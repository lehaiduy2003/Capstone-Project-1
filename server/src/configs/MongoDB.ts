import mongoose from "mongoose";
import dotenv from "dotenv";
import Connection from "./Connection";
dotenv.config();

class Mongoose extends Connection {
  private static instance: Mongoose;
  private isConnected = false;

  public static getInstance(): Mongoose {
    if (!Mongoose.instance) {
      Mongoose.instance = new Mongoose();
    }
    return Mongoose.instance;
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(String(process.env.DATABASE_URL), {
        serverSelectionTimeoutMS: 30000,
      });
      this.isConnected = true;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to connect to database");
    }
  }

  public async close(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log("Disconnected from database");
    }
  }
  public async getMongooseClient(): Promise<typeof mongoose> {
    if (!this.isConnected) {
      await this.connect();
    }
    return mongoose;
  }
}

// Sử dụng singleton
const mongoDB = Mongoose.getInstance();

export { mongoDB };
