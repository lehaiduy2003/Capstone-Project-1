import { z } from "zod";
import { Types, Document } from "mongoose";

const DonationSchema = z.object({
  user_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
  campaign_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
  createdAt: z.date().default(new Date()),
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
