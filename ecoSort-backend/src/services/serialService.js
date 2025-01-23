import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const SERIAL_PORT = "COM9";
let sPort;
let parser;

try {
  sPort = new SerialPort({
    path: SERIAL_PORT,
    baudRate: 9600,
  });

  parser = sPort.pipe(new ReadlineParser({ delimiter: "\n" }));

  sPort.on("open", () => console.log(`Serial port (${config.serialPort}) opened.`));
  sPort.on("error", (err) => console.error(`Serial port error: ${err.message}`));
} catch (error) {
  console.error(`Error setting up serial port: ${error.message}`);
}

export { sPort, parser };
