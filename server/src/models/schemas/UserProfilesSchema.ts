import { Schema } from "mongoose";
import { UserProfile } from "../../libs/zod/model/UserProfile";

const userProfilesSchema: Schema<UserProfile> = new Schema({
  name: { type: String },
  phone: { type: String },
  avatar: { type: String },
  dob: { type: Date },
  bio: { type: String },
  address: [{ type: String }],
  reputationScore: { type: Number, default: 100, required: true },
  followers: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  bought: { type: Number, default: 0 },
  account_id: {
    type: Schema.Types.ObjectId,
    ref: "Accounts",
    required: true,
  },
  products: [{ type: Schema.Types.ObjectId, ref: "Products" }],
  cart: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Products" },
      img: { type: String },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  ],
  likes: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Products" },
      img: { type: String },
      name: { type: String },
      price: { type: Number },
    },
  ],
});

userProfilesSchema.index({ phone: 1 }, { unique: true, sparse: true });
userProfilesSchema.index({ account_id: 1 }, { unique: true });
userProfilesSchema.index({ reputationScore: 1 });

export default userProfilesSchema;
