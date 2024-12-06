import AuthController from "../Controllers/AuthController";
import validateToken from "../../../middlewares/tokenMiddleware";
import AccountService from "../../Account/Services/AccountService";
import AuthService from "../Services/AuthService";
import UserProfileService from "../../UserProfile/Services/UserProfileService";
import BaseRouter from "../../../Base/BaseRouter";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import { Role } from "../../../libs/zod/enums/Role";

class AuthRouter extends BaseRouter {
  private readonly authController: AuthController;

  constructor(authController: AuthController) {
    super();
    this.authController = authController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post("/sign-in", this.authController.signIn.bind(this.authController));
    this.router.post("/sign-up", this.authController.signUp.bind(this.authController));
    this.router.post(
      "/refresh",
      validateToken,
      this.authController.generateNewAccessToken.bind(this.authController)
    );
    this.router.patch("/activate", this.authController.activateAccount.bind(this.authController));
    this.router.patch(
      "/deactivate",
      validateToken,
      authorizeUser([Role.Enum.customer]),
      this.authController.deactivateAccount.bind(this.authController)
    );
    this.router.patch(
      "/reset-password",
      this.authController.resetPassword.bind(this.authController)
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
