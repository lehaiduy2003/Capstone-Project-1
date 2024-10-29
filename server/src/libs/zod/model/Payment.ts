import { Document, Types } from "mongoose";
import { z } from "zod";

const PaymentSchema = z.object({
  user_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
  stripeId: z.string(),
  createdAt: z.date().default(new Date()),
});

export const validatePayment = (data: unknown) => {
  const result = PaymentSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Payment = z.infer<typeof PaymentSchema> & Document;
