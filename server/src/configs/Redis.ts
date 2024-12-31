import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";
import Connection from "../Base/Connection";
dotenv.config();

class Redis extends Connection {
  private static instance: Redis;
  private redisClient: RedisClientType | null = null;

  public static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  }

  public async connect(): Promise<void> {
    try {
      this.redisClient = createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT as string),
        },
      });

      this.redisClient.on("error", (error) => console.error(`Error : ${error}`));
      await this.redisClient.connect();
    } catch (error) {
      console.error(error);
      throw new Error("Failed to connect to Redis");
    }
  }

  public async getRedisClient(): Promise<RedisClientType> {
    if (!this.redisClient) {
      await this.connect();
    }
    return this.redisClient as RedisClientType;
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
const redis = Redis.getInstance();

export { redis };
