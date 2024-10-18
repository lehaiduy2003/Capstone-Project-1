import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect(): Promise<typeof mongoose> {
    if (this.isConnected) {
      console.log("Already connected to the database.");
      return mongoose;
    }

    try {
      await mongoose.connect(String(process.env.DATABASE_URL), {
        serverSelectionTimeoutMS: 30000,
      });
      this.isConnected = true;
      return mongoose;
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
}

// Sử dụng singleton
const mongoDBConnection = MongoDBConnection.getInstance();

export { mongoDBConnection };
