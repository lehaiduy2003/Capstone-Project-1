// import { model, Schema } from "mongoose";
// import { Payment } from "../../libs/zod/model/Payment";

// const paymentsSchema: Schema<Payment> = new Schema({
//   date: {
//     type: String,
//     required: true,
//   },
//   type: { type: String, enum: ["visa", "mastercard"], required: true },
//   cardHolder: { type: String, required: true },
//   cardNumber: { type: String, required: true },
//   user_id: { type: Schema.Types.ObjectId, required: true },
// });

// paymentsSchema.index({ type: 1 });
// paymentsSchema.index({ account: 1 });
// paymentsSchema.index({ date: 1 });

// const paymentsModel = model<Payment>("payments", paymentsSchema);

// export default paymentsModel;
