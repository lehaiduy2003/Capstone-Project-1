import BaseRouter from "../../../Base/BaseRouter";
import FollowerController from "../Controllers/FollowerController";
import FollowerService from "../Services/FollowerService";

class FollowerRouter extends BaseRouter {
  private readonly followerController: FollowerController;

  constructor(followerController: FollowerController) {
    super();
    this.followerController = followerController;
    this.initRoutes();
  }

  public initRoutes(): void {}
}

// /followers
const createFollowerRouter = (): FollowerRouter => {
  const followerService = new FollowerService();
  const followerController = new FollowerController(followerService);

  return new FollowerRouter(followerController);
};

export default createFollowerRouter;
