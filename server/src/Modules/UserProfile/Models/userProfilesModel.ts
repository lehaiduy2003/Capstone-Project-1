import { model, Schema } from "mongoose";
import { UserProfile } from "../../../libs/zod/model/UserProfile";

const userProfilesSchema: Schema<UserProfile> = new Schema({
  name: { type: String },
  phone: { type: String },
  avatar: { type: String },
  dob: { type: Date },
  bio: { type: String },
  address: { type: [String] },
  reputation_score: { type: Number, required: true },
  followers: { type: Number, required: true },
  following: { type: Number, required: true },
  account_id: {
    type: Schema.Types.ObjectId,
    ref: "accounts",
    required: true,
  },
  cart: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "products", unique: true },
      quantity: { type: Number },
    },
  ],
  wish_list: [{ type: Schema.Types.ObjectId, ref: "products", unique: true }],
  joined_campaigns: [{ type: Schema.Types.ObjectId, ref: "recycle_campaigns" }],
});

userProfilesSchema.index({ phone: 1 }, { unique: true, sparse: true });
userProfilesSchema.index({ account_id: 1 }, { unique: true });
userProfilesSchema.index({ reputation_score: 1 });

const userProfilesModel = model<UserProfile>("user_profiles", userProfilesSchema);

export default userProfilesModel;
