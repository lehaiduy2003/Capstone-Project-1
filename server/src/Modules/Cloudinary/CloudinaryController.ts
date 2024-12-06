import { Request, Response } from "express";
import CloudinaryService from "./CloudinaryService";
import errorHandler from "../../middlewares/errorMiddleware";

import dotenv from "dotenv";
dotenv.config();

export default class CloudinaryController {
  private readonly cloudinaryService: CloudinaryService;
  constructor(cloudinaryService: CloudinaryService) {
    this.cloudinaryService = cloudinaryService;
  }
  getSignature(req: Request, res: Response): void {
    try {
      const timestamp = Math.floor(new Date().getTime() / 1000); // Unix timestamp

      const paramsToSign = {
        timestamp,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET as string,
      };
      const signature = this.cloudinaryService.getSignature(paramsToSign);
      res.status(200).send(signature);
    } catch (error) {
      errorHandler(error, res);
    }
  }
}
