import TransactionController from "../Controllers/TransactionController";
import validateToken from "../../../middlewares/tokenMiddleware";
import TransactionService from "../Services/TransactionService";
import BaseRouter from "../../../Base/BaseRouter";
import {
  authenticateUserByReqBody,
  authenticateUserByReqParams,
  checkTokens,
} from "../../../middlewares/authenticationMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import { Role } from "../../../libs/zod/enums/Role";

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
      checkTokens,
      authenticateUserByReqBody,
      authorizeUser([Role.Enum.customer]),
      this.transactionController.create.bind(this.transactionController)
    );
    this.router.patch(
      "/:id",
      checkTokens,
      authenticateUserByReqBody,
      authorizeUser([Role.Enum.customer, Role.Enum.recycler]),
      this.transactionController.updateById.bind(this.transactionController)
    );
    this.router.get(
      "/:id",
      checkTokens,
      authorizeUser([Role.Enum.customer, Role.Enum.recycler]),
      this.transactionController.getById.bind(this.transactionController)
    );

    this.router.get(
      "/users/:id",
      checkTokens,
      authorizeUser([Role.Enum.customer, Role.Enum.recycler]),
      this.transactionController.getPendingTransactions.bind(this.transactionController)
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
