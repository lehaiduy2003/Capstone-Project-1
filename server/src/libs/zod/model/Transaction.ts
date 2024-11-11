import { z } from "zod";
import { Document } from "mongoose";
import ObjectIdSchema from "../ObjectId";
import TransactionStatusEnum from "../enums/TransactionStatus";

const TransactionSchema = z.object({
  user_id: ObjectIdSchema,
  total: z.number().positive(),
  invoice_id: ObjectIdSchema,
  shipper_id: ObjectIdSchema.optional(),
  transaction_status: TransactionStatusEnum, // This is equal to shipping status
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export const validateTransaction = (data: unknown) => {
  const result = TransactionSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type Transaction = z.infer<typeof TransactionSchema> & Document;
