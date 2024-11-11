import { z } from "zod";
import { Document } from "mongoose";
import ObjectIdSchema from "../ObjectId";

const DonationSchema = z.object({
  user_id: ObjectIdSchema,
  campaign_id: ObjectIdSchema,
  created_at: z.date().default(new Date()),
  donated: z.object({
    name: z.string(),
    img: z.string().url().optional(),
    content: z.string(),
    weight: z.number().positive(),
    quantity: z.number().int().positive(),
  }),
});

export const validateDonation = (data: unknown) => {
  const result = DonationSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Donation = z.infer<typeof DonationSchema> & Document;
