import ConnectionManager from "../configs/ConnectionManager";
import { mongoDB } from "../configs/MongoDB";
import { ngrokClient } from "../configs/Ngrok";
import { redis } from "../configs/Redis";

export default async function setupConnections(): Promise<void> {
  try {
    ConnectionManager.addConnection(mongoDB);
    ConnectionManager.addConnection(redis);
    ConnectionManager.addConnection(ngrokClient);
    await ConnectionManager.connect();
    console.log("Connection established successfully");
  } catch (error) {
    console.error("Failed to establish connections", error);
    await ConnectionManager.close();
    throw error;
  }
}
