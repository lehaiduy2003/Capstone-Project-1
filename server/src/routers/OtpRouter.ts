import OtpController from "../controllers/OtpController";
import EmailService from "../services/EmailService";
import BaseRouter from "./init/BaseRouter";

class OtpRouter extends BaseRouter {
  private readonly otpController: OtpController;

  public constructor(otpController: OtpController) {
    super();
    this.otpController = otpController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post("/send", this.otpController.sendOtp.bind(this.otpController));
    this.router.post("/verify", this.otpController.verifyOtp.bind(this.otpController));
  }
}

const createOtpRouter = (): OtpRouter => {
  const emailService = new EmailService();
  const otpController = new OtpController(emailService);

  return new OtpRouter(otpController);
};

export default createOtpRouter;
