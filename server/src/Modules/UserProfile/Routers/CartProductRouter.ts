import BaseRouter from "../../../Base/BaseRouter";
import CartProductController from "../Controllers/CartProductController";
import CartProductService from "../Services/CartProductService";
import { authorizeCustomer } from "../../../middlewares/authorizeMiddleware";
import authenticateToken from "../../../middlewares/tokenMiddleware";

class CartProductRouter extends BaseRouter {
  private readonly cartProductController: CartProductController;

  constructor(cartProductController: CartProductController) {
    super();
    this.cartProductController = cartProductController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      "/",
      authenticateToken,
      authorizeCustomer.compareInEqualRole,
      this.cartProductController.getCart.bind(this.cartProductController)
    );
    this.router.patch(
      "/:userId/add",
      authenticateToken,
      authorizeCustomer.compareInEqualRole,
      this.cartProductController.addProduct.bind(this.cartProductController)
    );
    this.router.delete(
      "/:userId/remove",
      authenticateToken,
      authorizeCustomer.compareInEqualRole,
      this.cartProductController.removeProduct.bind(this.cartProductController)
    );
    this.router.delete(
      "/:userId/clear",
      authenticateToken,
      authorizeCustomer.compareInEqualRole,
      this.cartProductController.clearCart.bind(this.cartProductController)
    );
  }
}

const createCartProductRouter = (): CartProductRouter => {
  const cartProductService = new CartProductService();
  const cartProductController = new CartProductController(cartProductService);
  return new CartProductRouter(cartProductController);
};

export default createCartProductRouter;
