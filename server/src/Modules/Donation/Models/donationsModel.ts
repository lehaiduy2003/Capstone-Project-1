import { Schema, model } from "mongoose";
import { Donation } from "../../../libs/zod/model/Donation";

const donationsSchema: Schema<Donation> = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "UserProfiles", required: true },
  campaign_id: {
    type: Schema.Types.ObjectId,
    ref: "RecycleCampaigns",
    required: true,
  },
  createdAt: { type: Date, required: true },
  donated: {
    name: { type: String, required: true },
    img: { type: String, required: true },
    content: { type: String, required: true },
    weight: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
});

const donationsModel = model<Donation>("donations", donationsSchema);

export default donationsModel;
