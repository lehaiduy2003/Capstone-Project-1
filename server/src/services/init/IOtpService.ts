export default interface IOtpService {
  sendOtp(identifier: string): Promise<boolean>;
  verifyOtp(identifier: string, otp: string): Promise<boolean>;
}
