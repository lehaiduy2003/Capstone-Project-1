import { model, Schema } from "mongoose";
import { Product } from "../libs/zod/model/Product";

const productsSchema: Schema<Product> = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  img: { type: String, required: true },
  description_content: { type: String, required: true },
  description_imgs: { type: [String], default: [] },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  type: { type: String, required: true },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  owner: { type: Schema.Types.ObjectId, ref: "UserProfiles" },
});

productsSchema.index({ status: 1, type: 1, price: 1, updatedAt: -1 });

const productsModel = model<Product>("products", productsSchema);

export default productsModel;
