import BaseRouter from "../../../Base/BaseRouter";
import { Role } from "../../../libs/zod/enums/Role";
import {
  authenticateUserByReqBody,
  checkTokens,
} from "../../../middlewares/authenticationMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import validateToken from "../../../middlewares/tokenMiddleware";
import ShippoController from "../Controllers/ShippoController";
import ShippoService from "../Services/ShippoService";

class ShippoRouter extends BaseRouter {
  private readonly shippoController: ShippoController;

  constructor(shippoController: ShippoController) {
    super();
    this.shippoController = shippoController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get("/:id", this.shippoController.findById.bind(this.shippoController));
    this.router.post(
      "/",
      checkTokens,
      authenticateUserByReqBody,
      authorizeUser([Role.Enum.recycler, Role.Enum.customer]),
      this.shippoController.createShipment.bind(this.shippoController)
    );
    this.router.post(
      "/parcels",
      checkTokens,
      authenticateUserByReqBody,
      authorizeUser([Role.Enum.recycler, Role.Enum.customer]),
      this.shippoController.createParcels.bind(this.shippoController)
    );
    this.router.get(
      "/parcels/:id",
      checkTokens,
      authorizeUser([Role.Enum.customer, Role.Enum.recycler]),
      this.shippoController.findParcel.bind(this.shippoController)
    );
    this.router.get(
      "/parcels/users/:id",
      checkTokens,
      authorizeUser([Role.Enum.customer, Role.Enum.recycler]),
      this.shippoController.findAllParcelsByUserId.bind(this.shippoController)
    );
  }
}

// "/shipping"
const createShippingRouter = (): ShippoRouter => {
  const shippoService = new ShippoService();
  const shippoController = new ShippoController(shippoService);

  return new ShippoRouter(shippoController);
};

export default createShippingRouter;
