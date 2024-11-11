import { model, Schema } from "mongoose";
import { Payment } from "../../../libs/zod/model/Payment";

const paymentsSchema: Schema<Payment> = new Schema({
  user_id: { type: Schema.Types.ObjectId, required: true },
  stripe_id: { type: String, required: true },
  created_at: { type: Date },
});

paymentsSchema.index({ user_id: 1 });
paymentsSchema.index({ stripe_id: 1 });

const paymentsModel = model<Payment>("payments", paymentsSchema);

export default paymentsModel;
