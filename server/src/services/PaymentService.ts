import dotenv from "dotenv";
import Stripe from "stripe";

import SessionService from "./init/SessionService";

import { CheckoutProductDTO } from "../libs/zod/dto/CheckoutProductDTO";

import calculateOrderAmount from "../utils/currency";
import paymentsModel from "../models/paymentsModel";

dotenv.config();

export default class PaymentService extends SessionService {
  private stripeClient: Stripe | null = null;

  public constructor() {
    super();
  }

  private async getStripeClient(): Promise<Stripe> {
    if (!this.stripeClient) {
      const { default: Stripe } = await import("stripe");
      this.stripeClient = new Stripe(String(process.env.STRIPE_SECRET_KEY));
    }
    return this.stripeClient;
  }

  async getCustomer(
    user_id: string,
    stripe: Stripe
  ): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    let customer: Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>;
    const user = await paymentsModel.findOne({ user_id: user_id });

    if (!user) {
      customer = await stripe.customers.create();
      const payment = new paymentsModel({ user_id: user_id, stripeCustomer_id: customer.id });
      const savedStatus = await payment.save();

      if (!savedStatus) {
        await this.abortTransaction();
        throw new Error("Failed to save payment");
      }
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
    user_id: string,
    products: CheckoutProductDTO[]
  ): Promise<string | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const stripe = await this.getStripeClient();
      const customer = await this.getCustomer(user_id, stripe);

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
