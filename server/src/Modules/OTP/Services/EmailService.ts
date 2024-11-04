import transporter from "../../../libs/nodemailer/transporter";

import mailOptions from "../../../libs/nodemailer/mailOptions";
import generateOTP from "../../../utils/generateOTP";

import getCache from "../../../libs/redis/cacheGetting";
import saveToCache from "../../../libs/redis/cacheSaving";
import deleteCache from "../../../libs/redis/cacheDeleting";

import IOtpService from "./Init/IOtpService";

export default class EmailService implements IOtpService {
  public constructor() {}

  async resend(identifier: string): Promise<boolean> {
    try {
      const cache = await getCache(identifier);
      if (!cache) return false; // return false if the cache is empty
      const type = JSON.parse(cache).type;
      await deleteCache(identifier);
      return this.send(identifier, type); // send a new OTP
    } catch (error) {
      await deleteCache(identifier);
      throw error;
    }
  }

  async send(identifier: string, type: string): Promise<boolean> {
    try {
      const otp = String(generateOTP()); // generate a 6 digit OTP otp

      if (await getCache(identifier)) return true; // return true if the cache is not empty (OTP already sent)

      await transporter.sendMail(mailOptions(identifier, otp));
      await saveToCache(identifier, 300, { type, otp });
      return true;
    } catch (error) {
      await deleteCache(identifier); // delete the cache if an error occurs
      throw error;
    }
  }

  async verify(
    identifier: string,
    type: string,
    otp: string,
  ): Promise<boolean> {
    try {
      const cacheOtp = await getCache(identifier);
      // console.log("cacheOtp", cacheOtp);
      if (!cacheOtp) return false; // return false if the cache is empty

      const parsedOtp: string = JSON.parse(cacheOtp).otp; // parse the OTP from the cache
      const parsedType: string = JSON.parse(cacheOtp).type; // parse the type from the cache
      // console.log("parsedOtp", parsedOtp);
      const isVerified = otp === parsedOtp && type === parsedType;
      if (isVerified) {
        await deleteCache(identifier);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }
}
