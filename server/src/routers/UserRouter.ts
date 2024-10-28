import UserController from "../controllers/UserController";
import UserProfileService from "../services/UserProfileService";
import BaseRouter from "./init/BaseRouter";

class UserRouter extends BaseRouter {
  private readonly userController: UserController;
  public constructor(userController: UserController) {
    super();
    this.userController = userController;
    this.initRoutes();
  }
  public initRoutes(): void {
    this.router.get("/:id", this.userController.getUserProfileById.bind(this.userController));
  }
}

const createUserRouter = (): UserRouter => {
  const userService = new UserProfileService();
  const userController = new UserController(userService);

  return new UserRouter(userController);
};

export default createUserRouter;
