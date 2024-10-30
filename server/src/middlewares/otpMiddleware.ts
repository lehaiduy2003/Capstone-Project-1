import { NextFunction, Request, Response } from "express";
import errorHandler from "./errorMiddleware";
import getCache from "../libs/redis/cacheGetting";

export const verifyEmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier, otp } = req.body;
    // console.log(req.body);
    const data = await getCache(identifier);
    if (data && isValidOtp(otp, data)) {
      next();
    } else {
      res.status(401).send({ message: "Invalid OTP" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

const isValidOtp = (otp: string, cache: string) => {
  const cachedOtp = JSON.parse(cache).otp;
  // console.log(cacheData);
  return cachedOtp === otp;
};
