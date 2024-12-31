import UserTransactionController from "../Controllers/UserTransactionController";
import UserTransactionService from "../Services/UserTransactionService";
import BaseRouter from "../../../Base/BaseRouter";
import {
  authenticateUserByReqParams,
  checkTokens,
} from "../../../middlewares/authenticationMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import { Role } from "../../../libs/zod/enums/Role";

class UserTransactionRouter extends BaseRouter {
  private readonly userTransactionController: UserTransactionController;
  public constructor(userTransactionController: UserTransactionController) {
    super();
    this.userTransactionController = userTransactionController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.get(
      "/",
      checkTokens,
      authenticateUserByReqParams,
      authorizeUser([Role.Enum.customer]),
      this.userTransactionController.getUserTransactions.bind(this.userTransactionController)
    );
  }
}

// /users/:id/transactions/
const createUserTransactionRouter = (): UserTransactionRouter => {
  const userTransactionService = new UserTransactionService();
  const userTransactionController = new UserTransactionController(userTransactionService);
  return new UserTransactionRouter(userTransactionController);
};

export default createUserTransactionRouter;
