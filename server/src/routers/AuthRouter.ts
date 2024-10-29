import AuthController from "../controllers/AuthController";
import authenticateToken from "../middlewares/tokenMiddleware";
import AccountService from "../services/AccountService";
import AuthService from "../services/AuthService";
import UserProfileService from "../services/UserProfileService";
import BaseRouter from "./init/BaseRouter";
import { verifyEmailOtp } from "../middlewares/otpMiddleware";

class AuthRouter extends BaseRouter {
  private readonly authController: AuthController;

  constructor(authController: AuthController) {
    super();
    this.authController = authController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      "/sign-in",
      this.authController.signIn.bind(this.authController),
    );
    this.router.post(
      "/sign-up",
      this.authController.signUp.bind(this.authController),
    );
    this.router.post(
      "/refresh",
      authenticateToken,
      this.authController.generateNewAccessToken.bind(this.authController),
    );
    this.router.post(
      "/activate",
      verifyEmailOtp,
      this.authController.activateAccount.bind(this.authController),
    );
  }
}

const createAuthRouter = (): AuthRouter => {
  const accountService = new AccountService();
  const userProfileService = new UserProfileService();
  const authService = new AuthService(accountService, userProfileService);
  const authController = new AuthController(authService);

  return new AuthRouter(authController);
};

export default createAuthRouter;
