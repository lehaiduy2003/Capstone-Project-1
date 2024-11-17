import { z } from "zod";
import { Document } from "mongoose";
import ObjectIdSchema from "../ObjectId";

const DonationSchema = z.object({
  user_id: ObjectIdSchema,
  campaign_id: ObjectIdSchema,
  created_at: z.date().default(new Date()),
  donated: z.object({
    name: z.string(),
    img: z.string().url({ message: "img must be an url" }).optional(),
    content: z.string(),
    weight: z
      .number({ message: "weight must be a number" })
      .positive({ message: "weight can not negative" }),
    quantity: z
      .number({ message: "quantity must be a number" })
      .int({ message: "quantity must be an integer" })
      .positive({ message: "quantity can not negative" }),
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
