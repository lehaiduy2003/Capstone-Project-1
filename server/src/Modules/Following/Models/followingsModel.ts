import { Schema, model } from "mongoose";
import { Follow } from "../../../libs/zod/model/Follow";

// Define schema for following document
const followingSchema: Schema<Follow> = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "user_profiles", required: true },
  following: {
    _id: { type: Schema.Types.ObjectId, ref: "user_profiles", required: true },
    followed_at: { type: Date, required: true },
  },
});

// Create indexes for the schema
followingSchema.index({ user_id: 1 });
followingSchema.index({ "following._id": 1 });

const followingsModel = model<Follow>("followings", followingSchema);

export default followingsModel;
