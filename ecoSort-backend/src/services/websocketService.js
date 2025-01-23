import WebSocket, { WebSocketServer } from "ws";
import { parser, sPort } from "./serialService.js";
import MESSAGE_TYPES from "../utils/messageTypes.js";
import Waste from "../models/waste.model.js";
const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  const broadcastMessage = (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  parser.on("data", (data) => {
    const trimmedData = data.trim();
    console.log(`Arduino: ${trimmedData}`);

    broadcastMessage({ type: MESSAGE_TYPES.ARDUINO_DATA, data: trimmedData });

    switch (trimmedData) {
      case "FULL_BIN_1":
        console.log("Trash is full! Notifying clients...");
        broadcastMessage({
          type: "trash_status",
          status: "full",
          message: "The trash bin is full! Please empty it.",
        });
        break;
      case "OK":
        console.log("Trash is not full.");
        broadcastMessage({
          type: "trash_status",
          status: "ok",
          message: "The trash bin has space.",
        });
        break;
      default:
        console.log("Received unrecognized data from Arduino.");
    }
  });

  wss.on("connection", (ws) => {
    console.log("Frontend connected via WebSocket");

    ws.on("message", async (message) => {
      try {
        const { type, modelClass, detectClass } = JSON.parse(message);

        if (modelClass === "base" || detectClass === "base") {
          console.log("Skipping base classification");
          return;
        }

        if (type === MESSAGE_TYPES.CLASSIFY) {
          const validClassifications = ["biodegradable", "non_biodegradable"];

          if (!validClassifications.includes(modelClass)) {
            ws.send(
              JSON.stringify({ type: MESSAGE_TYPES.ERROR, message: "Invalid model class type" })
            );
            return;
          }

          const wasteData = { category: detectClass, type: modelClass };

          try {
            const savedEntry = await new Waste(wasteData).save();
            console.log("Data successfully inserted into the database:", savedEntry);
          } catch (dbError) {
            console.error("Error inserting data into the database:", dbError);
            ws.send(
              JSON.stringify({
                type: MESSAGE_TYPES.ERROR,
                message: "Database error occurred while saving waste data",
              })
            );
            return;
          }

          const command = modelClass === "biodegradable" ? "D\n" : "N\n";
          sPort.write(command, (err) => {
            if (err) {
              ws.send(
                JSON.stringify({
                  type: MESSAGE_TYPES.ERROR,
                  message: "Failed to write to serial port",
                })
              );
              console.error("Error writing to serial port:", err.message);
              return;
            }
            console.log(`Sent '${command.trim()}' to Arduino`);
            ws.send(
              JSON.stringify({
                type: MESSAGE_TYPES.ACKNOWLEDGE,
                message: `Command '${command.trim()}' sent to Arduino`,
              })
            );
          });
        } else {
          ws.send(JSON.stringify({ type: MESSAGE_TYPES.ERROR, message: "Unknown message type" }));
        }
      } catch (err) {
        ws.send(
          JSON.stringify({ type: MESSAGE_TYPES.ERROR, message: "Failed to process message" })
        );
        console.error("Error processing message:", err.message);
      }
    });

    ws.on("close", () => {
      console.log("Frontend disconnected");
    });
  });
};

export { setupWebSocket };
