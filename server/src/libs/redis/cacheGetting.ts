import redisClientPromise from "./config";

export async function getCache(key: string) {
  try {
    const redisClient = await redisClientPromise();
    return await redisClient.get(key);
  } catch (error) {
    console.error("Error saving to cache: ", error);
  }
}
