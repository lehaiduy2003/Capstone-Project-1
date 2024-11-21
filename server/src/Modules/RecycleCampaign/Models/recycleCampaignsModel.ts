import { model, Schema } from "mongoose";
import { RecycleCampaign } from "../../../libs/zod/model/RecyclingCampaign";
import updateTimestamp from "../../../utils/updateTimestamp";

const recycleCampaignsSchema: Schema<RecycleCampaign> = new Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  description_content: { type: String },
  description_imgs: [{ type: String }],
  guide: { type: String },
  location: [{ type: String, required: true }],
  recycled_weight: { type: Number, required: true },
  recycled_amount: { type: Number, required: true },
  participants: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  creator_id: {
    type: Schema.Types.ObjectId,
    ref: "user_profiles",
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

recycleCampaignsSchema.pre("findOneAndUpdate", updateTimestamp);
recycleCampaignsSchema.pre("updateOne", updateTimestamp);

recycleCampaignsSchema.index({ name: 1 }, { unique: true });
recycleCampaignsSchema.index({ create_at: 1 });
recycleCampaignsSchema.index({ creator_id: 1 });

const recycleCampaignsModel = model<RecycleCampaign>("recycle_campaigns", recycleCampaignsSchema);

export default recycleCampaignsModel;
