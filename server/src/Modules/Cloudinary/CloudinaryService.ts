import Cloudinary from "../../configs/Cloudinary";

import dotenv from "dotenv";
dotenv.config();

type ParamsToSign = {
  timestamp: number;
  upload_preset: string;
  folder: string;
};

export default class CloudinaryService {
  constructor() {}

  getSignature(paramsToSign: ParamsToSign): object {
    const signature = Cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );

    return {
      signature,
      timestamp: paramsToSign.timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    };
  }
}
