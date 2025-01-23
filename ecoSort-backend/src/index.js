import dotenv from "dotenv";
import connectDb from "./db/index.js";
import app from "./app.js";
import { createServer } from "http";

import { setupWebSocket } from "./services/websocketService.js";


dotenv.config({ path: "./.env" });


const PORT = process.env.PORT || 4000;

const server = createServer(app);

setupWebSocket(server);

connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
