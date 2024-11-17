import ProductController from "../Controllers/ProductController";
import validateToken from "../../../middlewares/tokenMiddleware";
import checkCache from "../../../middlewares/cacheMiddleware";
import ProductService from "../Services/ProductService";
import BaseRouter from "../../../Base/BaseRouter";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import { authenticateUserByReqBody } from "../../../middlewares/authenticationMiddleware";

class ProductRouter extends BaseRouter {
  private readonly productController: ProductController;

  constructor(productController: ProductController) {
    super();
    this.productController = productController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get("/", checkCache, this.productController.findMany.bind(this.productController));
    this.router.get("/list", this.productController.findProductList.bind(this.productController));
    this.router.get(
      "/search",
      checkCache,
      this.productController.search.bind(this.productController)
    );
    this.router.get(
      "/:id",
      checkCache,
      this.productController.findById.bind(this.productController)
    );
    this.router.post(
      "/",
      validateToken,
      authorizeUser.isCustomerOrRecycler,
      this.productController.create.bind(this.productController)
    );
    this.router.patch(
      "/:id",
      validateToken,
      authenticateUserByReqBody,
      authorizeUser.isCustomerOrRecycler,
      this.productController.updateById.bind(this.productController)
    );
    this.router.delete(
      "/:id",
      validateToken,
      authorizeUser.isCustomerOrRecycler,
      this.productController.deleteById.bind(this.productController)
    );
  }
}

const createProductRouter = (): ProductRouter => {
  const productService = new ProductService();
  const productController = new ProductController(productService);

  return new ProductRouter(productController);
};

export default createProductRouter;
