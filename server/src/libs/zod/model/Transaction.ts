import { z } from "zod";
import { Document, Types } from "mongoose";
import ObjectIdSchema from "../ObjectId";

const TransactionSchema = z.object({
  user_id: ObjectIdSchema,
  total: z.number().positive(),
  invoice_id: ObjectIdSchema,
});

export const validateTransaction = (data: unknown) => {
  const result = TransactionSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type Transaction = z.infer<typeof TransactionSchema> & Document;
