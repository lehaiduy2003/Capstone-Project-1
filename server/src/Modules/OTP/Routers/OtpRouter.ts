import OtpController from "../Controllers/OtpController";
import EmailService from "../Services/EmailService";
import BaseRouter from "../../../Base/BaseRouter";

class OtpRouter extends BaseRouter {
  private readonly otpController: OtpController;

  public constructor(otpController: OtpController) {
    super();
    this.otpController = otpController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      "/send",
      this.otpController.sendOtp.bind(this.otpController),
    );
    this.router.post(
      "/verify",
      this.otpController.verifyOtp.bind(this.otpController),
    );
    this.router.post(
      "/resend",
      this.otpController.resendOtp.bind(this.otpController),
    );
  }
}

const createOtpRouter = (): OtpRouter => {
  const emailService = new EmailService();
  const otpController = new OtpController(emailService);

  return new OtpRouter(otpController);
};

export default createOtpRouter;
