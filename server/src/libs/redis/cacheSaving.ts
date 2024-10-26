import redisClientPromise from "./config";

/**
 *
 * @param key key to save the data
 * @param ex expiration time in seconds
 * @param data data to save
 */
export async function saveToCache(key: string, ex: number, data: object) {
  try {
    const redisClient = await redisClientPromise();
    await redisClient.setEx(key, ex, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to cache: ", error);
  }
}
