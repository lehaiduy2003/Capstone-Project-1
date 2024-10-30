import TransactionController from "../Controllers/TransactionController";
import authenticateToken from "../../../middlewares/tokenMiddleware";
import TransactionService from "../Services/TransactionService";
import BaseRouter from "../../../Base/BaseRouter";

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
      authenticateToken,
      this.transactionController.create.bind(this.transactionController),
    );
    this.router.patch(
      "/:id",
      authenticateToken,
      this.transactionController.updateById.bind(this.transactionController),
    );
    this.router.get(
      "/",
      authenticateToken,
      this.transactionController.getUserTransactions.bind(
        this.transactionController,
      ),
    );
  }
}

const createTransactionRouter = (): TransactionRouter => {
  const transactionService = new TransactionService();
  const transactionController = new TransactionController(transactionService);

  return new TransactionRouter(transactionController);
};

export default createTransactionRouter;
