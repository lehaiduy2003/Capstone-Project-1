import { model, Schema } from "mongoose";
import updateTimestamp from "../../../utils/updateTimestamp";
import { Post } from "../../../libs/zod/model/Post";

const PostSchema: Schema<Post> = new Schema({
  title: { type: String, required: true },
  description_content: { type: String },
  description_imgs: [{ type: String }],
  author_id: { type: Schema.Types.ObjectId, ref: "user_profiles", required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

PostSchema.pre("findOneAndUpdate", updateTimestamp);
PostSchema.pre("updateOne", updateTimestamp);

PostSchema.index({ updated_at: -1 });

const postModel = model<Post>("posts", PostSchema);

export default postModel;
