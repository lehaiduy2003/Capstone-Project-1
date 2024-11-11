import { Schema, model } from "mongoose";
import { Donation } from "../../../libs/zod/model/Donation";

const donationsSchema: Schema<Donation> = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "user_profiles", required: true },
  campaign_id: {
    type: Schema.Types.ObjectId,
    ref: "recycle_campaigns",
    required: true,
  },
  created_at: { type: Date, required: true },
  donated: {
    name: { type: String, required: true }, // name of the donation item
    img: { type: String, required: true },
    content: { type: String, required: true },
    weight: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
});

const donationsModel = model<Donation>("donations", donationsSchema);

export default donationsModel;
