import { OtpData } from "../../libs/zod/OtpData";

export default interface IOtpService {
  sendOtp(data: OtpData): Promise<boolean>;

  verifyOtp(identifier: string, otp: string): Promise<boolean>;
}
