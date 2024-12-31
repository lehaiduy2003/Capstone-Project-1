import UserProfileController from "../Controllers/UserProfileController";
import UserProfileService from "../Services/UserProfileService";
import BaseRouter from "../../../Base/BaseRouter";
import { checkTokens } from "../../../middlewares/authenticationMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import { Role } from "../../../libs/zod/enums/Role";
class UserProfileRouter extends BaseRouter {
  private readonly userController: UserProfileController;
  public constructor(userController: UserProfileController) {
    super();
    this.userController = userController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      "",
      checkTokens,
      authorizeUser([Role.Enum.admin]),
      this.userController.findMany.bind(this.userController)
    );
    this.router.get("/:id", this.userController.getUserProfileById.bind(this.userController));
    this.router.put(
      "/:id",
      checkTokens,
      authorizeUser([Role.Enum.customer, Role.Enum.recycler, Role.Enum.admin]),
      this.userController.updateById.bind(this.userController)
    );
    this.router.delete(
      "/:id",
      checkTokens,
      authorizeUser([Role.Enum.admin]),
      this.userController.deleteById.bind(this.userController)
    );
    this.router.post(
      "/",
      checkTokens,
      authorizeUser([Role.Enum.admin]),
      this.userController.create.bind(this.userController)
    );
  }
}

const createUserRouter = (): UserProfileRouter => {
  const userService = new UserProfileService();
  const userController = new UserProfileController(userService);
  return new UserProfileRouter(userController);
};

export default createUserRouter;
