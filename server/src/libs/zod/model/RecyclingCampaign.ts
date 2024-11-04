import { Document, Types } from "mongoose";
import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

const RecycleCampaignSchema = z.object({
  name: z.string(),
  img: z.string().url(),
  description_content: z.string().default(""),
  description_imgs: z.array(z.string().url()).default([]),
  recycledWeight: z.number().nonnegative().default(0),
  recycledAmount: z.number().nonnegative().default(0),
  participants: z.number().nonnegative().default(0),
  guide: z.string().url().default(""),
  location: z.array(z.string()).default([]),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
  owner: ObjectIdSchema,
  status: z.boolean().default(true),
});

export const validateRecycleCampaign = (data: unknown) => {
  const result = RecycleCampaignSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type RecycleCampaign = z.infer<typeof RecycleCampaignSchema> & Document;
