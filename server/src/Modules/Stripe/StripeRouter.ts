import validateToken from "../../middlewares/tokenMiddleware";
import BaseRouter from "../../Base/BaseRouter";
import StripeController from "./StripeController";
import StripeService from "./StripeService";
import PaymentService from "../Payment/Services/PaymentService";

class StripeRouter extends BaseRouter {
  private readonly stripeController: StripeController;

  constructor(stripeController: StripeController) {
    super();
    this.stripeController = stripeController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      "/checkout",
      validateToken,
      this.stripeController.createPaymentIntent.bind(this.stripeController)
    );
  }
}

const createStripeRouter = (): StripeRouter => {
  const paymentService = new PaymentService();
  const stripeService = new StripeService(paymentService);
  const stripeController = new StripeController(stripeService);

  return new StripeRouter(stripeController);
};

export default createStripeRouter;
