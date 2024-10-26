import PaymentController from "../controllers/PaymentController";
import authenticateToken from "../middlewares/authMiddleware";
import PaymentService from "../services/PaymentService";
import BaseRouter from "./init/BaseRouter";

class PaymentRouter extends BaseRouter {
  private paymentController: PaymentController;
  constructor(paymentController: PaymentController) {
    super();
    this.paymentController = paymentController;
    this.initRoutes();
  }
  public initRoutes(): void {
    this.router.post(
      "/checkout",
      authenticateToken,
      this.paymentController.createPaymentIntent.bind(this.paymentController)
    );
  }
}

const createPaymentRouter = (): PaymentRouter => {
  const paymentService = new PaymentService();
  const paymentController = new PaymentController(paymentService);

  return new PaymentRouter(paymentController);
};

export default createPaymentRouter;
