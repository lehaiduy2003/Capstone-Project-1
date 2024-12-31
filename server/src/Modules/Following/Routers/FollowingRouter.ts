import BaseRouter from "../../../Base/BaseRouter";
import FollowingController from "../Controllers/FollowingController";
import FollowingService from "../Services/FollowingService";

class FollowingRouter extends BaseRouter {
  private readonly followingController: FollowingController;

  constructor(followingController: FollowingController) {
    super();
    this.followingController = followingController;
    this.initRoutes();
  }

  public initRoutes(): void {}
}

const createFollowingRouter = (): FollowingRouter => {
  const followingService = new FollowingService();
  const followingController = new FollowingController(followingService);

  return new FollowingRouter(followingController);
};

export default createFollowingRouter;
