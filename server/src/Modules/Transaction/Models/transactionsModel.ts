import { model, Schema } from "mongoose";
import { Transaction } from "../../../libs/zod/model/Transaction";

const transactionsSchema: Schema<Transaction> = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "user_profiles",
    required: true,
  },
  total: { type: Number },
  invoice_id: {
    type: Schema.Types.ObjectId,
    ref: "invoices",
    required: true,
  },
  shipper_id: { type: Schema.Types.ObjectId, ref: "user_profiles" },
  transaction_status: {
    type: String,
    enum: ["pending", "delivering", "completed", "refunded"],
  },
  created_at: { type: Date },
  updated_at: { type: Date },
});

transactionsSchema.index({ user_id: 1 });
transactionsSchema.index({ shipper_id: 1 });
transactionsSchema.index({ transaction_status: 1 });

const transactionsModel = model<Transaction>("transactions", transactionsSchema);

export default transactionsModel;
