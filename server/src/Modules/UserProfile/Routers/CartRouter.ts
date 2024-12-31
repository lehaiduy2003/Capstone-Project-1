import BaseRouter from "../../../Base/BaseRouter";
import CartController from "../Controllers/CartController";
import CartService from "../Services/CartService";
import validateToken from "../../../middlewares/tokenMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import {
  authenticateUserByReqParams,
  checkTokens,
} from "../../../middlewares/authenticationMiddleware";
import { Role } from "../../../libs/zod/enums/Role";

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
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer]),
      this.cartProductController.getCart.bind(this.cartProductController)
    );
    // Overwrite cart with new products, and remove all products if the empty array is sent
    this.router.put(
      "/",
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer]),
      this.cartProductController.setCart.bind(this.cartProductController)
    );
    // For add, update quantity, and even remove product (for reduce quantity to zero user's action) in cart
    this.router.patch(
      "/product",
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer]),
      this.cartProductController.updateProduct.bind(this.cartProductController)
    );
    // For remove product (instantly) from cart
    this.router.delete(
      "/product/:productId",
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer]),
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
