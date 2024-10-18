import { Types } from "mongoose";
import { z } from "zod";
import { PaymentStatusSchema, StatusSchema } from "../model/Transaction";

export const TransactionUpdateDTOSchema = z.object({
  _id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) =>
      typeof val === "string" ? new Types.ObjectId(val) : val,
    ),
  status: StatusSchema,
  paymentStatus: PaymentStatusSchema,
});

export const validateTransactionUpdateDTO = (data: unknown) => {
  const result = TransactionUpdateDTOSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type TransactionUpdateDTO = z.infer<typeof TransactionUpdateDTOSchema>;
