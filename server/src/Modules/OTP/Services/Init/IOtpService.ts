export default interface IOtpService {
  send(identifier: string, type: string): Promise<boolean>;

  resend(identifier: string): Promise<boolean>;

  verify(identifier: string, type: string, otp: string): Promise<boolean>;
}
