import { model, Schema } from "mongoose";
import { Transaction } from "../../libs/zod/model/Transaction";

const transactionsSchema: Schema<Transaction> = new Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  buyer: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "UserProfiles",
      required: true,
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
  },
  seller: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "UserProfiles",
      required: true,
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
  },
  products: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      name: { type: String, required: true },
      img: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  paymentMethod: { type: String, enum: ["cash", "card"], required: true },
  paymentStatus: { type: String, enum: ["pending", "paid"], required: true },
  shippingFee: { type: Number, default: 30000 },
  status: {
    type: String,
    enum: ["pending", "shipping", "completed", "refunded"],
    default: "pending",
  },
  // user_id: {
  //   type: Schema.Types.ObjectId,
  //   ref: "UserProfiles",
  //   required: true,
  // },
});

transactionsSchema.index({ "products._id": 1 });
transactionsSchema.index({ status: 1 });
transactionsSchema.index({ createdAt: -1 });

export default transactionsSchema;
