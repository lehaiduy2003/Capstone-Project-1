import dotenv from "dotenv";
import paymentsModel from "../Models/paymentsModel";
import { ObjectId } from "mongodb";
import { ClientSession } from "mongoose";
import { Payment } from "../../../libs/zod/model/Payment";

dotenv.config();

export default class PaymentService {
  public constructor() {}

  async findByUserId(user_id: ObjectId): Promise<Payment | null> {
    return paymentsModel.findOne({ user_id: user_id }).lean();
  }

  async create(
    user_id: ObjectId,
    stripeId: string,
    session: ClientSession,
  ): Promise<Payment> {
    const payment = new paymentsModel({ user_id: user_id, stripeId: stripeId });
    const createdStatus = await payment.save({ session });

    if (!createdStatus) {
      await session.abortTransaction();
      throw new Error("Failed to save payment");
    }
    return createdStatus;
  }
}
