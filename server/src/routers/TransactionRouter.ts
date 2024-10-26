import TransactionController from "../controllers/TransactionController";
import authenticateToken from "../middlewares/authMiddleware";
import TransactionsModel from "../models/TransactionsModel";
import TransactionService from "../services/TransactionService";
import BaseRouter from "./init/BaseRouter";

class TransactionRouter extends BaseRouter {
  private readonly transactionController: TransactionController;

  constructor(transactionController: TransactionController) {
    super();
    this.transactionController = transactionController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      "/transactions",
      authenticateToken,
      this.transactionController.createTransaction.bind(this.transactionController)
    );
    this.router.patch(
      "/transactions/:id",
      authenticateToken,
      this.transactionController.updateTransaction.bind(this.transactionController)
    );
    this.router.get(
      "/transactions",
      authenticateToken,
      this.transactionController.getUserTransactions.bind(this.transactionController)
    );
  }
}

const createTransactionRouter = (): TransactionRouter => {
  const transactionsModel = new TransactionsModel();
  const transactionService = new TransactionService(transactionsModel);
  const transactionController = new TransactionController(transactionService);

  return new TransactionRouter(transactionController);
};

export default createTransactionRouter;
