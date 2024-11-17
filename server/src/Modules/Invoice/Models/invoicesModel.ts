import { model, Schema } from "mongoose";
import { Invoice } from "../../../libs/zod/model/Invoice";

const invoicesSchema: Schema<Invoice> = new Schema({
  products: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      name: { type: String, required: true },
      img: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      owner: { type: Schema.Types.ObjectId, ref: "user_profiles", required: true },
    },
  ],
  from: { type: String },
  to: { type: String },
  payment_method: { type: String, enum: ["cash", "card"], required: true },
  payment_status: { type: String, enum: ["unpaid", "paid"], required: true },
  payment_intent: { type: String },
});

invoicesSchema.index({ "products._id": 1 });
invoicesSchema.index({ status: 1 });

const invoicesModel = model<Invoice>("invoices", invoicesSchema);

export default invoicesModel;
