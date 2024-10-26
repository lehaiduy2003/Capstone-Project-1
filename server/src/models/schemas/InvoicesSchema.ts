// import { model, Schema } from "mongoose";
// import { Invoice } from "../../libs/zod/model/Invoice";

// const invoicesSchema: Schema<Invoice> = new Schema({
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
//   buyer: {
//     _id: {
//       type: Schema.Types.ObjectId,
//       ref: "UserProfiles",
//       required: true,
//     },
//     address: { type: String, required: true },
//     phone: { type: String, required: true },
//     name: { type: String, required: true },
//   },
//   seller: {
//     _id: {
//       type: Schema.Types.ObjectId,
//       ref: "UserProfiles",
//       required: true,
//     },
//     address: { type: String, required: true },
//     phone: { type: String, required: true },
//     name: { type: String, required: true },
//   },
//   products: [
//     {
//       _id: {
//         type: Schema.Types.ObjectId,
//         ref: "Products",
//         required: true,
//       },
//       name: { type: String, required: true },
//       img: { type: String, required: true },
//       price: { type: Number, required: true },
//       quantity: { type: Number, required: true },
//     },
//   ],
//   paymentMethod: { type: String, enum: ["cash", "card"], required: true },
//   paymentStatus: { type: String, enum: ["pending", "paid"], required: true },
// });

// invoicesSchema.index({ "products._id": 1 });
// invoicesSchema.index({ status: 1 });
// invoicesSchema.index({ createdAt: -1 });

// const invoicesModel = model<Invoice>("invoices", invoicesSchema);

// export default invoicesModel;
