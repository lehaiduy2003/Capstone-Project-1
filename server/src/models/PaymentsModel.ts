// server/models/product.js
import { Model, Schema } from "mongoose";
import BaseModel from "./init/BaseModel";
import { Payment } from "../libs/zod/model/Payment";

const paymentsSchema: Schema<Payment> = new Schema({
  date: {
    type: String,
    required: true,
  },
  type: { type: String, enum: ["visa", "mastercard"], required: true },
  cardHolder: { type: String, required: true },
  cardNumber: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true },
});

paymentsSchema.index({ type: 1 });
paymentsSchema.index({ account: 1 });
paymentsSchema.index({ date: 1 });

export default class PaymentsModel extends BaseModel<
  PaymentsModel & Model<Payment>,
  Payment
> {
  public constructor() {
    super("payment", paymentsSchema);
  }
}
