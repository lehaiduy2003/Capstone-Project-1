import { z } from "zod";
import ObjectIdSchema from "../ObjectId";
import transactionStatusEnum from "../enums/TransactionStatus";
import { ProductDTOSchema } from "./ProductDTO";
import PaymentStatusEnum from "../enums/PaymentStatus";
import PaymentMethodEnum from "../enums/PaymentMethod";

// For get and update transaction
// Some fields are optional because we don't need to update all fields
// Or not allowed to update some fields
const TransactionDTOSchema = z.object({
  // transaction id
  _id: ObjectIdSchema,
  user_id: ObjectIdSchema,
  total: z
    .number({ message: "total must be a number" })
    .nonnegative({ message: "total can not negative" })
    .optional(),
  product: ProductDTOSchema,
  shipping_address: z.string(),
  payment_method: PaymentMethodEnum,
  payment_status: PaymentStatusEnum,
  transaction_status: transactionStatusEnum,
  shipper_id: ObjectIdSchema.optional(),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
});

export const validateTransactionDTO = (data: unknown) => {
  const result = TransactionDTOSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type TransactionDTO = z.infer<typeof TransactionDTOSchema>;
