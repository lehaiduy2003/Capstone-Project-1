// import dotenv from "dotenv";
// dotenv.config();

// import OtpService from "./OtpService";

// export default class SmsService extends OtpService {
//   public constructor() {
//     super();
//   }

//   async sendOtp(identifier: string): Promise<boolean> {
//     return (await import("../libs/twilio/otpSending")).default(identifier);
//   }

//   async verifyOtp(identifier: string, otp: string): Promise<boolean> {
//     return (await import("../libs/twilio/otpVerifying")).default(identifier, otp);
//   }
// }
