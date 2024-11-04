import { z } from "zod";
import { Types, Document } from "mongoose";
import ObjectIdSchema from "../ObjectId";

export const NotificationSchema = z.object({
  account_id: ObjectIdSchema,
  title: z.string(),
  date: z.date(),
  content: z.string(),
});

export const validateNotification = (data: unknown) => {
  const result = NotificationSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Notification = z.infer<typeof NotificationSchema> & Document;
