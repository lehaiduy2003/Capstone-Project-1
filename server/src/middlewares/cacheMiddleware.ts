import { NextFunction, Request, Response } from "express";

import { redisConnection } from "../configs/redis";

import errorHandler from "./errorMiddleware";
import { generateCacheKey } from "../libs/redis/keyGenerating";

export default async function checkCache(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cacheKey = generateCacheKey(req);
    console.log("Checking cache for key: ", cacheKey);

    const redisClient = await redisConnection.connect();
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Returning cached data");
      res.status(200).send(JSON.parse(cachedData));
      return;
    }
    // Attach cacheKey to the request object for later use
    req.body.cacheKey = cacheKey;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
}
