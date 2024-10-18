import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";
dotenv.config();

class RedisConnection {
  private static instance: RedisConnection;
  private redisClient: RedisClientType | null = null;

  private constructor() {}

  public static getInstance(): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
    }
    return RedisConnection.instance;
  }

  public async connect(): Promise<RedisClientType> {
    if (this.redisClient) {
      console.log("Already connected to Redis.");
      return this.redisClient;
    }

    try {
      this.redisClient = createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        },
      });

      this.redisClient.on("error", (error) => console.error(`Error : ${error}`));
      await this.redisClient.connect();
      return this.redisClient;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to connect to Redis");
    }
  }

  public async close(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
      this.redisClient = null;
      console.log("Disconnected from Redis");
    }
  }
}

// Sử dụng singleton
const redisConnection = RedisConnection.getInstance();

export { redisConnection };
