import { z } from "zod";
import ObjectIdSchema from "./ObjectId";

const DonateSchema = z.object({
  userId: ObjectIdSchema,
  campaignId: ObjectIdSchema,
  content: z.string(),
  quantity: z.string(),
  weight: z.string(),
});

export const validateDonate = (data: unknown) => {
  try {
    const result = DonateSchema.safeParse(data);
    if (!result.success) throw result.error;
    return result.data;
  } catch (error) {
    throw error;
  }
};

export type Donate = z.infer<typeof DonateSchema>;
