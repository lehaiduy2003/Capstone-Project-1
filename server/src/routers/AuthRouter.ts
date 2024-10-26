import AuthController from "../controllers/AuthController";
import authenticateToken from "../middlewares/authMiddleware";
import AccountsModel from "../models/AccountsModel";
import UserProfilesModel from "../models/UserProfilesModel";
import AccountService from "../services/AccountService";
import AuthService from "../services/AuthService";
import UserProfileService from "../services/UserProfileService";
import BaseRouter from "./init/BaseRouter";

class AuthRouter extends BaseRouter {
  private authController: AuthController;
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
      authenticateToken,
      this.authController.generateNewAccessToken.bind(this.authController)
    );
  }
}

const createAuthRouter = (): AuthRouter => {
  const accountsModel = new AccountsModel();
  const accountService = new AccountService(accountsModel);

  const userProfilesModel = new UserProfilesModel();
  const userProfileService = new UserProfileService(userProfilesModel);

  const authService = new AuthService(accountService, userProfileService);
  const authController = new AuthController(authService);

  return new AuthRouter(authController);
};

export default createAuthRouter;
