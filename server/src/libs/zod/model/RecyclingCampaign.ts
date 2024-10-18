import { Document, Types } from "mongoose";
import { z } from "zod";

export const RecycleCampaignSchema = z.object({
  name: z.string(),
  img: z.string().url(),
  description: z
    .object({
      content: z.string(),
      imgs: z.array(z.string().url()).optional(),
    })
    .optional(),
  recycledWeight: z.number().default(0),
  recycledAmount: z.number().default(0),
  participants: z.number().default(0),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
  user_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) =>
      typeof val === "string" ? new Types.ObjectId(val) : val,
    ),
  status: z.boolean().default(true),
});

export const validateRecycleCampaign = (data: unknown) => {
  const result = RecycleCampaignSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type RecycleCampaign = z.infer<typeof RecycleCampaignSchema> & Document;
export interface IRecycleCampaign extends Document, RecycleCampaign {}
