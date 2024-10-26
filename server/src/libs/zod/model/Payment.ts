import { Document, Types } from "mongoose";
import { z } from "zod";

const PaymentSchema = z.object({
  date: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid date format, expected MM/YY"),
  user_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
  cardNumber: z.string().length(16),
  cardHolder: z.string(),
  type: z.enum(["visa", "mastercard"]),
});

export const validatePayment = (data: unknown) => {
  const result = PaymentSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Payment = z.infer<typeof PaymentSchema> & Document;
