import BaseRouter from "../../../Base/BaseRouter";
import CartController from "../Controllers/CartController";
import CartService from "../Services/CartService";
import validateToken from "../../../middlewares/tokenMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import { authenticateUserByReqParams } from "../../../middlewares/authenticationMiddleware";

class CartRouter extends BaseRouter {
  private readonly cartProductController: CartController;

  constructor(cartProductController: CartController) {
    super();
    this.cartProductController = cartProductController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      "/",
      validateToken,
      authenticateUserByReqParams,
      authorizeUser.isCustomer,
      this.cartProductController.getCart.bind(this.cartProductController)
    );
    // Overwrite cart with new products, and remove all products if the empty array is sent
    this.router.put(
      "/",
      validateToken,
      authenticateUserByReqParams,
      authorizeUser.isCustomer,
      this.cartProductController.setCart.bind(this.cartProductController)
    );
    // For add, update quantity, and even remove product (for reduce quantity to zero user's action) in cart
    this.router.patch(
      "/product",
      validateToken,
      authenticateUserByReqParams,
      authorizeUser.isCustomer,
      this.cartProductController.updateProduct.bind(this.cartProductController)
    );
    // For remove product (instantly) from cart
    this.router.delete(
      "/product/:productId",
      validateToken,
      authenticateUserByReqParams,
      authorizeUser.isCustomer,
      this.cartProductController.removeProduct.bind(this.cartProductController)
    );
  }
}

const createCartRouter = (): CartRouter => {
  const cartService = new CartService();
  const cartController = new CartController(cartService);
  return new CartRouter(cartController);
};

export default createCartRouter;
