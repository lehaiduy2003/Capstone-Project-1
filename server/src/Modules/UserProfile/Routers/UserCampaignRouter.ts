import UserCampaignController from "../Controllers/UserCampaignController";
import BaseRouter from "../../../Base/BaseRouter";
import UserCampaignService from "../Services/UserCampaignService";
import validateToken from "../../../middlewares/tokenMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import { Role } from "../../../libs/zod/enums/Role";
import {
  authenticateUserByReqParams,
  checkTokens,
} from "../../../middlewares/authenticationMiddleware";
class UserProfileRouter extends BaseRouter {
  private readonly userCampaignController: UserCampaignController;
  public constructor(userCampaignController: UserCampaignController) {
    super();
    this.userCampaignController = userCampaignController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      "/",
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer]),
      this.userCampaignController.getUserCampaignByUserId.bind(this.userCampaignController)
    );

    this.router.delete(
      "/:id",
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer]),
      this.userCampaignController.leaveCampaign.bind(this.userCampaignController)
    );

    this.router.patch(
      "/:id",
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer]),
      this.userCampaignController.joinCampaign.bind(this.userCampaignController)
    );
  }
}

// /users/:id/campaigns/
const createUserCampaignRouter = (): UserProfileRouter => {
  const userCampaignService = new UserCampaignService();
  const userCampaignController = new UserCampaignController(userCampaignService);
  return new UserProfileRouter(userCampaignController);
};

export default createUserCampaignRouter;
