import { z } from "zod";
import { Document } from "mongoose";
import ObjectIdSchema from "../ObjectId";

// Schema cho Reply (được nhúng trong Review)
const ReplySchema = z.object({
  _id: ObjectIdSchema,
  reviewer_id: ObjectIdSchema,
  name: z.string(),
  avatar: z.string().url({ message: "avatar must be an url" }),
  comment: z.string(),
});

// Schema cho Review
export const ReviewSchema = z.object({
  reviewer_id: ObjectIdSchema,
  reviewer_avatar: z.string().url({ message: "avatar must be an url" }),
  reviewered_id: ObjectIdSchema,
  rate: z.number({ message: "rate must be a number" }).min(1).max(5),
  comment: z.string(),
  reviewed_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
  reply: z.array(ReplySchema).default([]),
  on_model: z.enum(["UserProfiles", "Products"]),
});

export const validateReview = (data: unknown) => {
  const result = ReviewSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Review = z.infer<typeof ReviewSchema> & Document;
