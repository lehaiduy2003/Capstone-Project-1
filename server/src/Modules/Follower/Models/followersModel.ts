import { Schema, model } from "mongoose";
import { Follow } from "../../../libs/zod/model/Follow";

// Define schema for follower document
const followersSchema: Schema<Follow> = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "user_profiles", required: true },
  following: {
    _id: { type: Schema.Types.ObjectId, ref: "user_profiles", required: true },
    followed_at: { type: Date, required: true },
  },
});

// Create indexes for the schema
followersSchema.index({ user_id: 1 });
followersSchema.index({ "following._id": 1 });

const followersModel = model<Follow>("followers", followersSchema);

export default followersModel;
