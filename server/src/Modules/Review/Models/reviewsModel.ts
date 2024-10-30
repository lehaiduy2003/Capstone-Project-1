import { Schema, model } from "mongoose";
import { Review } from "../../../libs/zod/model/Review";

export const reviewsSchema: Schema<Review> = new Schema({
  reviewer_id: {
    type: Schema.Types.ObjectId,
    ref: "UserProfiles",
    required: true,
  },
  reviewerAvatar: { type: String, required: true },
  reviewered_id: {
    type: Schema.Types.ObjectId,
    refPath: "onModel",
    required: true,
  },
  rate: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  reviewedAt: { type: Date },
  updatedAt: { type: Date },
  reply: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      reviewer_id: {
        type: Schema.Types.ObjectId,
        ref: "UserProfiles",
        required: true,
      },
      name: { type: String, required: true },
      avatar: { type: String, required: true },
      comment: { type: String, required: true },
    },
  ],
  onModel: {
    type: String,
    required: true,
    enum: ["UserProfiles", "Products"], // Các model mà Review có thể thuộc về
  },
});

const reviewsModel = model<Review>("reviews", reviewsSchema);

export default reviewsModel;
