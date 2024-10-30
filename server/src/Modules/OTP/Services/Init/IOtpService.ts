export default interface IOtpService {
  send(identifier: string): Promise<boolean>;

  resend(identifier: string): Promise<boolean>;

  verify(identifier: string, otp: string): Promise<boolean>;
}
