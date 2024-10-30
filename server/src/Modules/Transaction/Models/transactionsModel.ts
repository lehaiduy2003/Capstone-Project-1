import { model, Schema } from "mongoose";
import { Transaction } from "../../../libs/zod/model/Transaction";

const transactionsSchema: Schema<Transaction> = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "UserProfiles",
    required: true,
  },
  total: { type: Number },
  invoice_id: {
    type: Schema.Types.ObjectId,
    ref: "Invoices",
    required: true,
  },
});

transactionsSchema.index({ "invoice._id": 1 });
transactionsSchema.index({ status: 1 });
transactionsSchema.index({ updatedAt: -1 });

const transactionsModel = model<Transaction>(
  "transactions",
  transactionsSchema,
);

export default transactionsModel;
