import { OtpData } from "../../../../libs/zod/OtpData";

export default interface IOtpService {
  send(data: OtpData): Promise<boolean>;

  resend(data: OtpData): Promise<boolean>;

  verify(identifier: string, otp: string): Promise<boolean>;
}
