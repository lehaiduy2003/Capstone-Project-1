import { z } from "zod";
import { Document } from "mongoose";
import { ProductDTOSchema } from "../dto/ProductDTO";
import PaymentMethodEnum from "../enums/PaymentMethod";
import PaymentStatusEnum from "../enums/PaymentStatus";

const InvoiceSchema = z
  .object({
    products: ProductDTOSchema.array(),
    from: z.string(),
    to: z.string(),
    payment_status: PaymentStatusEnum,
    payment_method: PaymentMethodEnum,
    payment_intent: z.string().optional(), // paymentIntent is optional for cash payment
  })
  .refine(
    (data) => {
      // if paymentMethod is card, paymentIntent must not be undefined
      if (data.payment_method === "card") {
        return data.payment_intent !== undefined;
      }
      if (data.products.length === 0) {
        return false;
      }
    },
    {
      message: "Invalid Invoice",
    }
  );

export const validateInvoice = (data: unknown) => {
  const result = InvoiceSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Invoice = z.infer<typeof InvoiceSchema> & Document;
