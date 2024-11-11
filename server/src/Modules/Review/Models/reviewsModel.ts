import { Schema, model } from "mongoose";
import { Review } from "../../../libs/zod/model/Review";

export const reviewsSchema: Schema<Review> = new Schema({
  reviewer_id: {
    type: Schema.Types.ObjectId,
    ref: "user_profiles",
    required: true,
  },
  reviewer_avatar: { type: String, required: true },
  reviewered_id: {
    type: Schema.Types.ObjectId,
    refPath: "on_model",
    required: true,
  },
  rate: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  reviewed_at: { type: Date },
  updated_at: { type: Date },
  reply: [
    {
      _id: { type: Schema.Types.ObjectId, auto: true },
      reviewer_id: {
        type: Schema.Types.ObjectId,
        ref: "user_profiles",
        required: true,
      },
      name: { type: String, required: true },
      avatar: { type: String, required: true },
      comment: { type: String, required: true },
    },
  ],
  on_model: {
    type: String,
    required: true,
    enum: ["user_profiles", "products"], // Các model mà Review có thể thuộc về
  },
});

const reviewsModel = model<Review>("reviews", reviewsSchema);

export default reviewsModel;
