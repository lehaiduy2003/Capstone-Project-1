import UserProfileController from "../Controllers/UserProfileController";
import UserProfileService from "../Services/UserProfileService";
import BaseRouter from "../../../Base/BaseRouter";
import checkCache from "../../../middlewares/cacheMiddleware";

class UserProfileRouter extends BaseRouter {
  private readonly userController: UserProfileController;

  public constructor(userController: UserProfileController) {
    super();
    this.userController = userController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      "/:id",
      checkCache,
      this.userController.getUserProfileById.bind(this.userController),
    );
  }
}

const createUserRouter = (): UserProfileRouter => {
  const userService = new UserProfileService();
  const userController = new UserProfileController(userService);

  return new UserProfileRouter(userController);
};

export default createUserRouter;
