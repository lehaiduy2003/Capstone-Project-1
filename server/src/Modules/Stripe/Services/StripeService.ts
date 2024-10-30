import dotenv from "dotenv";
import Stripe from "stripe";

import SessionService from "../../../Base/SessionService";

import { CheckoutProductDTO } from "../../../libs/zod/dto/CheckoutProductDTO";

import calculateOrderAmount from "../../../utils/currency";
import PaymentService from "../../Payment/Services/PaymentService";
import { ObjectId } from "mongodb";

dotenv.config();

export default class StripeService extends SessionService {
  private stripeClient: Stripe | null = null;
  private paymentsService: PaymentService;

  public constructor(paymentService: PaymentService) {
    super();
    this.paymentsService = paymentService;
  }

  private async getStripeClient(): Promise<Stripe> {
    if (!this.stripeClient) {
      const { default: Stripe } = await import("stripe");
      this.stripeClient = new Stripe(String(process.env.STRIPE_SECRET_KEY));
    }
    return this.stripeClient;
  }

  async getCustomer(
    user_id: ObjectId,
    stripe: Stripe,
  ): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    let customer: Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>;
    const user = await this.paymentsService.findByUserId(user_id);
    // console.log("user", user);
    if (!user) {
      customer = await stripe.customers.create();
      await this.paymentsService.create(
        user_id,
        customer.id,
        this.getSession(),
      );
    } else {
      customer = await stripe.customers.retrieve(user.stripeId);
    }
    return customer;
  }

  /**
   * create a payment intent with stripe, return the payment intent client secret
   * @returns {Promise<string>}
   * @param user_id
   * @param products
   */
  async createPaymentIntent(
    user_id: ObjectId,
    products: CheckoutProductDTO[],
  ): Promise<string | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const stripe = await this.getStripeClient();
      const customer = await this.getCustomer(user_id, stripe);
      // console.log("customer", customer);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(products),
        currency: "vnd",
        customer: customer.id,
      });

      if (!paymentIntent) {
        await this.abortTransaction();
        return null;
      }

      await this.commitTransaction();
      return paymentIntent.client_secret;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }
}
