import transporter from "../libs/nodemailer/transporter";
import mailOptions from "../libs/nodemailer/mailOptions";

import { saveToCache } from "../libs/redis/cacheSaving";
import { deleteCache } from "../libs/redis/cacheDeleting";
import { getCache } from "../libs/redis/cacheGetting";
import generateOTP from "../utils/generateOTP";
import IOtpService from "./init/IOtpService";

export default class EmailService implements IOtpService {
  public constructor() {}
  async sendOtp(identifier: string): Promise<boolean> {
    try {
      const otp = String(generateOTP()); // generate a 6 digit OTP code

      if (await getCache(identifier)) return true;

      await transporter.sendMail(mailOptions(identifier, otp));
      await saveToCache(identifier, 300, { otp }); // save the OTP to the cache
      return true; // after sending the email, return the OTP for verification
    } catch (error) {
      console.error("Error sending OTP:", error);
      await deleteCache(identifier); // delete the cache if an error occurs
      return false;
    }
  }

  async verifyOtp(identifier: string, otp: string): Promise<boolean> {
    const cacheOtp = await getCache(identifier); // get the OTP from the cache

    if (!cacheOtp) return false; // return false if the cache is empty

    const parsedOtp = JSON.parse(cacheOtp as string).otp; // parse the OTP from the cache

    if (otp === parsedOtp) {
      await deleteCache(identifier); // delete the cache after the OTP has been verified
      return true;
    }
    return false;
  }
}
