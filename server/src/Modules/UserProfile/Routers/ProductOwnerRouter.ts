import BaseRouter from "../../../Base/BaseRouter";
import { Role } from "../../../libs/zod/enums/Role";
import {
  authenticateUserByReqParams,
  checkTokens,
} from "../../../middlewares/authenticationMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import validateToken from "../../../middlewares/tokenMiddleware";
import ProductOwnerController from "../Controllers/ProductOwnerController";
import ProductOwnerService from "../Services/ProductOwnerService";

class ProductOwnerRouter extends BaseRouter {
  private readonly productOwnerController: ProductOwnerController;

  constructor(productOwnerController: ProductOwnerController) {
    super();
    this.productOwnerController = productOwnerController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      "/",
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer, Role.Enum.recycler]),
      this.productOwnerController.findByOwner.bind(this.productOwnerController)
    );

    this.router.post(
      "/",
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer, Role.Enum.recycler]),
      this.productOwnerController.create.bind(this.productOwnerController)
    );
    this.router.patch(
      "/:productId",
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer, Role.Enum.recycler]),
      this.productOwnerController.updateById.bind(this.productOwnerController)
    );
    this.router.delete(
      "/:productId",
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer, Role.Enum.recycler]),
      this.productOwnerController.deleteById.bind(this.productOwnerController)
    );
  }
}
// /users/:user_id/products
const createProductOwnerRouter = (): ProductOwnerRouter => {
  const productOwnerService = new ProductOwnerService();
  const productOwnerController = new ProductOwnerController(productOwnerService);
  return new ProductOwnerRouter(productOwnerController);
};

export default createProductOwnerRouter;
