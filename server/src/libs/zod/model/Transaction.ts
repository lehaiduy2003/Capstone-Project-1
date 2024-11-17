import { z } from "zod";
import { Document } from "mongoose";
import ObjectIdSchema from "../ObjectId";
import TransactionStatusEnum from "../enums/TransactionStatus";
import { ProductDTOSchema } from "../dto/ProductDTO";
import PaymentStatusEnum from "../enums/PaymentStatus";
import PaymentMethodEnum from "../enums/PaymentMethod";

const TransactionSchema = z
  .object({
    user_id: ObjectIdSchema,
    total: z
      .number({ message: "total must be a number" })
      .nonnegative({ message: "total can not negative" }),
    product: ProductDTOSchema,
    shipping_address: z.string(),
    payment_status: PaymentStatusEnum.default("unpaid"),
    payment_method: PaymentMethodEnum.default("cash"),
    payment_intent: z.string().optional(), // paymentIntent is optional for cash payment
    shipper_id: ObjectIdSchema.optional(),
    transaction_status: TransactionStatusEnum.default("pending"), // This is equal to shipping status
    created_at: z.date().default(new Date()),
    updated_at: z.date().default(new Date()),
  })
  .refine(
    (data) => {
      // if paymentMethod is card, paymentIntent must not be undefined
      if (data.payment_method === "card") {
        return data.payment_intent !== undefined;
      }
    },
    {
      message: "Invalid transaction data",
    }
  );

export const validateTransaction = (data: unknown) => {
  const result = TransactionSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type Transaction = z.infer<typeof TransactionSchema> & Document;
