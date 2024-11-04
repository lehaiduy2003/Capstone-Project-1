import BaseRouter from "../../../Base/BaseRouter";
import CartProductController from "../Controllers/CartProductController";
import CartProductService from "../Services/CartProductService";
import UserProfileService from "../Services/UserProfileService";
import ProductService from "../../Product/Services/ProductService";
import { authorizeCustomer } from "../../../middlewares/authorizeMiddleware";

class CartProductRouter extends BaseRouter {
  private readonly cartProductController: CartProductController;

  constructor(cartProductController: CartProductController) {
    super();
    this.cartProductController = cartProductController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      "/:productId",
      authorizeCustomer.compareInEqualRole,
      this.cartProductController.addProduct,
    );
    this.router.delete(
      "/:productId",
      authorizeCustomer.compareInEqualRole,
      this.cartProductController.removeProduct,
    );
    this.router.delete(
      "/",
      authorizeCustomer.compareInEqualRole,
      this.cartProductController.clearCart,
    );
  }
}

const createCartProductRouter = (): CartProductRouter => {
  const userProfileService = new UserProfileService();
  const productService = new ProductService();

  const cartProductService = new CartProductService(
    userProfileService,
    productService,
  );
  const cartProductController = new CartProductController(cartProductService);
  return new CartProductRouter(cartProductController);
};

export default createCartProductRouter;
