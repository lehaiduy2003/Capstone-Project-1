import { model, Schema } from "mongoose";
import { Product } from "../../libs/zod/model/Product";

const productsSchema: Schema<Product> = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  description: {
    content: { type: String, required: true },
    imgs: [{ type: String }],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  type: { type: String, required: true },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

productsSchema.index({ status: 1, type: 1, price: 1, updatedAt: -1 });

export default productsSchema;
