import { NextFunction, Request, Response } from "express";
import errorHandler from "./errorMiddleware";
import getCache from "../libs/redis/cacheGetting";

export const verifyEmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { identifier, otp, type } = req.body;
    // console.log(req.body);
    const data = await getCache(identifier);
    if (data) {
      // console.log("data", data);
      const parsedData = JSON.parse(data);
      if (parsedData.otp === otp && parsedData.type === type) {
        delete req.body.otp; // delete the OTP from the request body after verification
        req.body = { ...req.body, ...parsedData }; // add the parsed data to the request body
        next();
      }
    } else {
      res.status(401).send({ message: "Invalid OTP" });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
