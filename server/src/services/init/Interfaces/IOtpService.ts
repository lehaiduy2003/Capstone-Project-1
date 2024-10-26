export default interface IOtpService {
  sendOtp(identifier: string): Promise<string>;
  verifyOtp(identifier: string, otp: string): Promise<boolean>;
}
