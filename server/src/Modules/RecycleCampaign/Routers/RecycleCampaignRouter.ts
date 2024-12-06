import checkCache from "../../../middlewares/cacheMiddleware";
import BaseRouter from "../../../Base/BaseRouter";
import RecycleCampaignController from "../Controllers/RecycleCampaignController";
import validateToken from "../../../middlewares/tokenMiddleware";
import { authenticateUserByReqBody } from "../../../middlewares/authenticationMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import RecycleCampaignService from "../Services/RecycleCampaignService";
import { Role } from "../../../libs/zod/enums/Role";

class RecycleCampaignRouter extends BaseRouter {
  private readonly recycleCampaignController: RecycleCampaignController;

  constructor(recycleCampaignController: RecycleCampaignController) {
    super();
    this.recycleCampaignController = recycleCampaignController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      "/",
      checkCache,
      this.recycleCampaignController.findMany.bind(this.recycleCampaignController)
    );
    this.router.get(
      "/search",
      checkCache,
      this.recycleCampaignController.search.bind(this.recycleCampaignController)
    );
    this.router.get(
      "/:id",
      checkCache,
      this.recycleCampaignController.findById.bind(this.recycleCampaignController)
    );
    this.router.post(
      "/",
      validateToken,
      authenticateUserByReqBody,
      authorizeUser([Role.Enum.recycler]),
      this.recycleCampaignController.create.bind(this.recycleCampaignController)
    );
  }
}

// "/campaigns"
const createRecycleCampaignRouter = (): RecycleCampaignRouter => {
  const recycleCampaignService = new RecycleCampaignService();
  const recycleCampaignController = new RecycleCampaignController(recycleCampaignService);

  return new RecycleCampaignRouter(recycleCampaignController);
};

export default createRecycleCampaignRouter;
