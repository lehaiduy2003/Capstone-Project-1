import { NextFunction, Request, Response } from "express";
import EmailService from "../services/EmailService";
import errorHandler from "./errorMiddleware";
import getCache from "../libs/redis/cacheGetting";

const emailOtp = new EmailService();

export const verifyEmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier, otp } = req.body;
    const isVerified = await emailOtp.verifyOtp(identifier, otp);

    if (isVerified) {
      const data = await getCache(identifier);

      if (data) {
        const parsedData = JSON.parse(data);
        delete parsedData.otp;
        req.body = { ...req.body, ...parsedData };
        // console.log(req.body);
      }
      next();
    } else {
      res.status(401).send({ message: "Invalid OTP" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
