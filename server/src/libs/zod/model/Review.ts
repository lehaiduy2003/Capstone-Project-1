import { z } from "zod";
import { Document, Types } from "mongoose";

// Schema cho Reply (được nhúng trong Review)
const ReplySchema = z.object({
  _id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
  reviewer_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
  name: z.string(),
  avatar: z.string().url(),
  comment: z.string(),
});

// Schema cho Review
export const ReviewSchema = z.object({
  reviewer_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
  reviewerAvatar: z.string().url(),
  reviewered_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
  rate: z.number().min(1).max(5),
  comment: z.string(),
  reviewedAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
  reply: z.array(ReplySchema).default([]),
  onModel: z.enum(["UserProfiles", "Products"]),
});

export const validateReview = (data: unknown) => {
  const result = ReviewSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Review = z.infer<typeof ReviewSchema> & Document;
