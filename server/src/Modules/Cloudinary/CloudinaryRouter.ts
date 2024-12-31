import BaseRouter from "../../Base/BaseRouter";
import { authenticateUserByReqBody, checkTokens } from "../../middlewares/authenticationMiddleware";
import validateToken from "../../middlewares/tokenMiddleware";
import CloudinaryController from "./CloudinaryController";
import CloudinaryService from "./CloudinaryService";

class CloudinaryRouter extends BaseRouter {
  private readonly cloudinaryController: CloudinaryController;

  public constructor(cloudinaryController: CloudinaryController) {
    super();
    this.cloudinaryController = cloudinaryController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      "/sign",
      checkTokens,
      authenticateUserByReqBody,
      this.cloudinaryController.getSignature.bind(this.cloudinaryController)
    );
  }
}

const createCloudinaryRouter = (): CloudinaryRouter => {
  const cloudinaryService = new CloudinaryService();
  const cloudinaryController = new CloudinaryController(cloudinaryService);

  return new CloudinaryRouter(cloudinaryController);
};

export default createCloudinaryRouter;
