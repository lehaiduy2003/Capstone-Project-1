import { Types } from "mongoose";
import { z } from "zod";
import ObjectIdSchema from "../ObjectId";
import transactionStatusEnum from "../enums/TransactionStatusEnum";

const TransactionUpdateDTOSchema = z.object({
  // transaction id
  _id: ObjectIdSchema,
  user_id: ObjectIdSchema,
  status: transactionStatusEnum,
});

export const validateTransactionUpdateDTO = (data: unknown) => {
  const result = TransactionUpdateDTOSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type TransactionUpdateDTO = z.infer<typeof TransactionUpdateDTOSchema>;
