import { model, Schema } from "mongoose";
import { UserProfile } from "../../../libs/zod/model/UserProfile";

const userProfilesSchema: Schema<UserProfile> = new Schema({
  name: { type: String },
  phone: { type: String },
  avatar: { type: String },
  dob: { type: Date },
  bio: { type: String },
  address: { type: [String] },
  reputationScore: { type: Number, required: true },
  followers: { type: Number, required: true },
  following: { type: Number, required: true },
  account_id: {
    type: Schema.Types.ObjectId,
    ref: "Accounts",
    required: true,
  },
  cart: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Products" },
      img: { type: String },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
      owner: { type: Schema.Types.ObjectId, ref: "UserProfiles" },
    },
  ],
  likes: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Products" },
      img: { type: String },
      name: { type: String },
      price: { type: Number },
      owner: { type: Schema.Types.ObjectId, ref: "UserProfiles" },
    },
  ],
  joinedCampaigns: [{ type: Schema.Types.ObjectId, ref: "RecycleCampaigns" }],
});

userProfilesSchema.index({ phone: 1 }, { unique: true, sparse: true });
userProfilesSchema.index({ account_id: 1 }, { unique: true });
userProfilesSchema.index({ reputationScore: 1 });

const userProfilesModel = model<UserProfile>(
  "user_profiles",
  userProfilesSchema,
);

export default userProfilesModel;
