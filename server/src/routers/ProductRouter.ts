import ProductController from "../controllers/ProductController";
import authenticateToken from "../middlewares/tokenMiddleware";
import checkCache from "../middlewares/cacheMiddleware";
import ProductService from "../services/ProductService";
import BaseRouter from "./init/BaseRouter";

class ProductRouter extends BaseRouter {
  private readonly productController: ProductController;

  constructor(productController: ProductController) {
    super();
    this.productController = productController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      "/",
      this.productController.getProducts.bind(this.productController),
    );
    this.router.get(
      "/search",
      checkCache,
      this.productController.searchProducts.bind(this.productController),
    );
    this.router.get(
      "/:id",
      this.productController.getProductById.bind(this.productController),
    );
    this.router.post(
      "/",
      authenticateToken,
      this.productController.createProduct.bind(this.productController),
    );
    this.router.patch(
      "/:id",
      authenticateToken,
      this.productController.updateProductById.bind(this.productController),
    );
    this.router.delete(
      "/:id",
      authenticateToken,
      this.productController.deleteProductById.bind(this.productController),
    );
  }
}

const createProductRouter = (): ProductRouter => {
  const productService = new ProductService();
  const productController = new ProductController(productService);

  return new ProductRouter(productController);
};

export default createProductRouter;
