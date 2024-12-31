import { Document } from "mongoose";
import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

const PostSchema = z.object({
  title: z.string(),
  description_content: z.string().optional(),
  description_imgs: z.array(z.string()).optional(),
  author_id: ObjectIdSchema,
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export const validatePost = (data: unknown) => {
  const result = PostSchema.safeParse(data);

  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type Post = z.infer<typeof PostSchema>;
