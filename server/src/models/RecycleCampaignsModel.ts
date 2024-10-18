// server/models/product.js
import { Model, Schema } from "mongoose";
import BaseModel from "./init/BaseModel";
import { RecycleCampaign } from "../libs/zod/model/RecyclingCampaign";

const recycleCampaignsSchema: Schema<RecycleCampaign> = new Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  description: {
    content: { type: String, required: true },
    imgs: [{ type: String }],
  },
  recycledWeight: { type: Number, required: true },
  recycledAmount: { type: Number, required: true },
  participants: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "UserProfiles",
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

recycleCampaignsSchema.index({ name: 1 });
recycleCampaignsSchema.index({ createAt: 1 });
recycleCampaignsSchema.index({ userId: 1 });

export default class RecycleCampaignsModel extends BaseModel<
  RecycleCampaignsModel & Model<RecycleCampaign>,
  RecycleCampaign
> {
  public constructor() {
    super("recycle", recycleCampaignsSchema);
  }
}
