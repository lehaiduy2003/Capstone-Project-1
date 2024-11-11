import { Document } from "mongoose";
import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

const PaymentSchema = z.object({
  user_id: ObjectIdSchema,
  stripe_id: z.string(),
  created_at: z.date().default(new Date()),
});

export const validatePayment = (data: unknown) => {
  const result = PaymentSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Payment = z.infer<typeof PaymentSchema> & Document;
