import { z } from "zod";
import { ProductDTOSchema } from "./ProductDTO";
import { TraderDTOSchema } from "./TraderDTO";
import {
  PaymentMethodSchema,
  PaymentStatusSchema,
  StatusSchema,
} from "../model/Transaction";

export const TransactionDTOSchema = z.object({
  products: ProductDTOSchema.array(),
  buyer: TraderDTOSchema,
  seller: TraderDTOSchema,
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema,
  status: StatusSchema,
});

export const validateTransactionDTO = (data: unknown) => {
  const result = TransactionDTOSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type TransactionDTO = z.infer<typeof TransactionDTOSchema>;
