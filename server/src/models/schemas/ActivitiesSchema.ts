import { Schema } from "mongoose";
import { Activity } from "../../libs/zod/model/Activity";

const activitiesSchema: Schema<Activity> = new Schema({
  date: { type: Date, required: true, default: Date.now },
  log: { type: String, required: true },
  actor: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "Accounts",
      required: true,
    },
    role: { type: String, enum: ["customer", "admin", "recycler"] },
  },
});

activitiesSchema.index({ date: 1 });
activitiesSchema.index({ "actor.id": 1 });
activitiesSchema.index({ "actor.role": 1 });

export default activitiesSchema;
