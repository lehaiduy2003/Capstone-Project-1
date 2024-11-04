import ProfileEditingController from "../Controllers/ProfileEditingController";
import authenticateToken from "../../../middlewares/tokenMiddleware";
import ProfileEditingService from "../Services/ProfileEditingService";
import BaseRouter from "../../../Base/BaseRouter";

class ProfileEditingRouter extends BaseRouter {
  private readonly profileEditingController: ProfileEditingController;

  public constructor(profileEditingController: ProfileEditingController) {
    super();
    this.profileEditingController = profileEditingController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.patch(
      "/change-password",
      authenticateToken,
      this.profileEditingController.changePassword.bind(
        this.profileEditingController,
      ),
    );
  }
}

const createProfileEditingRouter = () => {
  const profileEditingService = new ProfileEditingService();
  const profileEditingController = new ProfileEditingController(
    profileEditingService,
  );
  return new ProfileEditingRouter(profileEditingController);
};

export default createProfileEditingRouter;
