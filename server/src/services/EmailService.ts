import transporter from "../libs/nodemailer/transporter";

import mailOptions from "../libs/nodemailer/mailOptions";
import generateOTP from "../utils/generateOTP";

import getCache from "../libs/redis/cacheGetting";
import saveToCache from "../libs/redis/cacheSaving";
import deleteCache from "../libs/redis/cacheDeleting";

import IOtpService from "./init/IOtpService";
import { OtpData } from "../libs/zod/OtpData";

export default class EmailService implements IOtpService {
  public constructor() {}

  async sendOtp(data: OtpData): Promise<boolean> {
    try {
      const otp = String(generateOTP()); // generate a 5 digit OTP code

      if (await getCache(data.identifier)) return true; // return true if the cache is not empty

      await transporter.sendMail(mailOptions(data.identifier, otp));
      data.otp = otp; // add the OTP to the data
      await saveToCache(data.identifier, 300, data); // save the OTP to the cache
      return true; // after sending the identifier, return the OTP for verification
    } catch (error) {
      console.error("Error sending OTP:", error);
      await deleteCache(data.identifier); // delete the cache if an error occurs
      return false;
    }
  }

  async verifyOtp(identifier: string, otp: string): Promise<boolean> {
    try {
      const cacheOtp = await getCache(identifier); // get the OTP from the cache
      // console.log("cacheOtp", cacheOtp);
      if (!cacheOtp) return false; // return false if the cache is empty

      const parsedOtp: string = JSON.parse(cacheOtp).otp; // parse the OTP from the cache
      // console.log("parsedOtp", parsedOtp);
      return otp === parsedOtp;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return false;
    }
  }
}
