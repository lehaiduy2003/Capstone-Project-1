import dotenv from "dotenv";
import Stripe from "stripe";

import BaseService from "./init/BaseService";

import { CheckoutProductDTO } from "../libs/zod/dto/CheckoutProductDTO";

import { calculateOrderAmount } from "../utils/currency";
import PaymentsModel from "../models/PaymentsModel";
import { Payment } from "../libs/zod/model/Payment";
import { ClientSession } from "mongoose";
import { Filter } from "../libs/zod/Filter";
import { keyValue } from "../libs/zod/keyValue";

dotenv.config();
const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

export default class PaymentService extends BaseService<
  PaymentsModel,
  Payment
> {
  read(
    field: keyof Payment,
    keyValue: keyValue,
    filter: Filter,
  ): Promise<Payment[] | null> {
    throw new Error("Method not implemented.");
  }
  create(
    data: Partial<Payment>,
    session: ClientSession,
  ): Promise<Payment | null> {
    throw new Error("Method not implemented.");
  }
  update(
    field: keyof Payment,
    keyValue: keyValue,
    data: Partial<Payment>,
    session: ClientSession,
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(
    field: keyof Payment,
    keyValue: keyValue,
    session: ClientSession,
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public constructor() {
    super("payment");
  }

  /**
   * create a payment intent with stripe, return the payment intent client secret
   * @param {[{id: ObjectId, name: string, img: string, price: number, quantity: number}]} items
   * @returns {Promise<string>}
   */
  async createPaymentIntent(
    products: CheckoutProductDTO[],
  ): Promise<string | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(products),
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
      console.error(error);
      throw new Error("error while creating payment intent");
    } finally {
      await this.endSession();
    }
  }
}
