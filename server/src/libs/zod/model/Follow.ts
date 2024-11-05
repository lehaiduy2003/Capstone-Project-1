import { z } from "zod";
import { Document } from "mongoose";
import ObjectIdSchema from "../ObjectId";

const FollowSchema = z.object({
  user_id: ObjectIdSchema,
  following: z.object({
    _id: ObjectIdSchema,
    name: z.string(),
    avatar: z.string().url(),
    followedAt: z.date().default(new Date()),
  }),
});

export const validateFollower = (data: unknown) => {
  const result = FollowSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Follow = z.infer<typeof FollowSchema> & Document;
