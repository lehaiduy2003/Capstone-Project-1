import { Schema, model } from "mongoose";
import { Notification } from "../../../libs/zod/model/Notification";

const notificationsSchema: Schema<Notification> = new Schema({
  account_id: {
    type: Schema.Types.ObjectId,
    ref: "UserProfiles",
    required: true,
  },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  content: { type: String, required: true },
});

const notificationsModel = model<Notification>(
  "notifications",
  notificationsSchema,
);

export default notificationsModel;
