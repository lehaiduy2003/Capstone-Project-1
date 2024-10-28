import redisClientPromise from "./config";

const deleteCache = async (key: string): Promise<void> => {
  try {
    const redisClient = await redisClientPromise();
    if ((await redisClient.exists(key)) === 0) {
      console.log(`Cache with key ${key} does not exist.`);
      return;
    }
    await redisClient.del(key);
    console.log(`Cache with key ${key} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting cache with key ${key}:`, error);
  }
};

export default deleteCache;
