import redisClientPromise from "./config";

const getCache = async (key: string) => {
  try {
    const redisClient = await redisClientPromise();
    // console.log("Getting cache", await redisClient.get(key));
    return await redisClient.get(key);
  } catch (error) {
    console.error("Error saving to cache: ", error);
  }
};

export default getCache;
