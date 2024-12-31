import { model, Schema } from "mongoose";
import { Transaction } from "../../../libs/zod/model/Transaction";

const transactionsSchema: Schema<Transaction> = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "user_profiles",
    required: true,
  },
  product: {
    _id: { type: Schema.Types.ObjectId, ref: "products" },
    name: { type: String },
    img: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    owner: { type: Schema.Types.ObjectId, ref: "user_profiles" },
  },
  total: { type: Number },
  shipper_id: { type: Schema.Types.ObjectId, ref: "user_profiles" },
  shipping_address: { type: String },
  payment_method: { type: String, enum: ["card", "cash"] },
  payment_intent: { type: String },
  payment_status: { type: String, enum: ["paid", "unpaid"] },
  transaction_status: {
    type: String,
    enum: ["pending", "transporting", "delivering", "completed", "refunded"],
  },
  created_at: { type: Date },
  updated_at: { type: Date },
});

transactionsSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

transactionsSchema.index({ user_id: 1 });
transactionsSchema.index({ shipper_id: 1 });
transactionsSchema.index({ transaction_status: 1 });

const transactionsModel = model<Transaction>("transactions", transactionsSchema);

export default transactionsModel;
