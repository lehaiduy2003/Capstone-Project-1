import { redis } from "../../configs/Redis";

const redisClientPromise = async () => {
  return await redis.getRedisClient();
};

export default redisClientPromise;
