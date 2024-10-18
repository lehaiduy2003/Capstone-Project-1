import { redisConnection } from "../../configs/redis";

export async function saveToCache(key: string, data: object) {
  try {
    const redisClient = await redisConnection.connect();
    await redisClient.setEx(key, 3600, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to cache: ", error);
  }
}
