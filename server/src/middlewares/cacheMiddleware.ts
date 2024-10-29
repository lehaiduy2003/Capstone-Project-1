import { NextFunction, Request, Response } from "express";

import errorHandler from "./errorMiddleware";
import generateCacheKey from "../libs/redis/keyGenerating";
import getCache from "../libs/redis/cacheGetting";

const checkCache = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cacheKey = generateCacheKey(req);

    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      res.status(200).send(JSON.parse(cachedData));
      return;
    }
    // Attach cacheKey to the request object for later use
    req.body.cacheKey = cacheKey;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
};

export default checkCache;
