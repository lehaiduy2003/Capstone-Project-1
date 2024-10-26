import dotenv from "dotenv";
import Stripe from "stripe";

import SessionService from "./init/BaseService";

import { CheckoutProductDTO, validateCheckoutProductDTO } from "../libs/zod/dto/CheckoutProductDTO";

import { calculateOrderAmount } from "../utils/currency";
import { Product } from "../libs/zod/model/Product";

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
  /**
   * create a payment intent with stripe, return the payment intent client secret
   * @param {[{id: ObjectId, name: string, img: string, price: number, quantity: number}]} items
   * @returns {Promise<string>}
   */
  async createPaymentIntent(products: Partial<Product>[]): Promise<string | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const parsedProducts: CheckoutProductDTO[] = products
        .map((product: Partial<Product>) => validateCheckoutProductDTO(product))
        .filter((product: Partial<Product>): product is CheckoutProductDTO => product !== null);
      const stripe = await this.getStripeClient();

      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(parsedProducts),
        currency: "vnd",
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
