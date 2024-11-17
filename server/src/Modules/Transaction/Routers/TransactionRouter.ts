import TransactionController from "../Controllers/TransactionController";
import validateToken from "../../../middlewares/tokenMiddleware";
import TransactionService from "../Services/TransactionService";
import BaseRouter from "../../../Base/BaseRouter";
import {
  authenticateUserByReqBody,
  authenticateUserByReqParams,
} from "../../../middlewares/authenticationMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";

class TransactionRouter extends BaseRouter {
  private readonly transactionController: TransactionController;

  constructor(transactionController: TransactionController) {
    super();
    this.transactionController = transactionController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      "/",
      validateToken,
      authenticateUserByReqBody,
      authorizeUser.isCustomer,
      this.transactionController.create.bind(this.transactionController)
    );
    this.router.patch(
      "/:id",
      validateToken,
      authenticateUserByReqBody,
      authorizeUser.isShipper,
      this.transactionController.updateById.bind(this.transactionController)
    );
    this.router.get(
      "/:userId",
      validateToken,
      authenticateUserByReqParams,
      authorizeUser.isCustomer,
      this.transactionController.getUserTransactions.bind(this.transactionController)
    );
  }
}
// "/transactions"
const createTransactionRouter = (): TransactionRouter => {
  const transactionService = new TransactionService();
  const transactionController = new TransactionController(transactionService);

  return new TransactionRouter(transactionController);
};

export default createTransactionRouter;
