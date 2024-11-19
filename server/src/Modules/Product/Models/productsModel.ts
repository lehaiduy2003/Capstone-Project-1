import { model, Schema } from "mongoose";
import { Product } from "../../../libs/zod/model/Product";
import updateTimestamp from "../../../utils/updateTimestamp";

const productsSchema: Schema<Product> = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  img: { type: String, required: true },
  description_content: { type: String, required: true },
  description_imgs: { type: [String], default: [] },
  created_at: { type: Date },
  updated_at: { type: Date },
  type: { type: String, required: true },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  owner: { type: Schema.Types.ObjectId, ref: "user_profiles" },
});

productsSchema.pre("findOneAndUpdate", updateTimestamp);
productsSchema.pre("updateOne", updateTimestamp);

productsSchema.index({ status: 1 });
productsSchema.index({ type: 1 });
productsSchema.index({ type: 1, price: 1, updated_at: -1 });
const productsModel = model<Product>("products", productsSchema);

export default productsModel;
