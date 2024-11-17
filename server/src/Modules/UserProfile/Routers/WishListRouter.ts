import BaseRouter from "../../../Base/BaseRouter";
import { authenticateUserByReqParams } from "../../../middlewares/authenticationMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import validateToken from "../../../middlewares/tokenMiddleware";
import WishListController from "../Controllers/WishListController";
import WishListService from "../Services/WishListService";

class WishlistRouter extends BaseRouter {
  private readonly wishListController: WishListController;
  constructor(wishListController: WishListController) {
    super();
    this.wishListController = wishListController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      "/",
      validateToken,
      authenticateUserByReqParams,
      authorizeUser.isCustomer,
      this.wishListController.getWishList.bind(this.wishListController)
    );
    // Overwrite wish list with new products, can not remove all products
    this.router.put(
      "/product",
      validateToken,
      authenticateUserByReqParams,
      authorizeUser.isCustomer,
      this.wishListController.setWishList.bind(this.wishListController)
    );
    this.router.patch(
      "/product/:productId",
      validateToken,
      authenticateUserByReqParams,
      authorizeUser.isCustomer,
      this.wishListController.updateProduct.bind(this.wishListController)
    );
    this.router.delete(
      "/product/:productId",
      validateToken,
      authenticateUserByReqParams,
      authorizeUser.isCustomer,
      this.wishListController.removeProduct.bind(this.wishListController)
    );
  }
}

const createWishListRouter = (): WishlistRouter => {
  const wishListService = new WishListService();
  const wishListController = new WishListController(wishListService);
  return new WishlistRouter(wishListController);
};

export default createWishListRouter;
