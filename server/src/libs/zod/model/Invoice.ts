import { z } from "zod";
import { Document } from "mongoose";
import { ProductDTOSchema } from "../dto/ProductDTO";
import PaymentMethodEnum from "../enums/PaymentMethod";
import PaymentStatusEnum from "../enums/PaymentStatus";

const InvoiceSchema = z
  .object({
    products: ProductDTOSchema.array(),
    paymentIntent: z.string().optional(), // paymentIntent is optional for cash payment
    shipping_id: z.string().optional(), // will not be undefined (undefined for using test purpose)
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
    paymentStatus: PaymentStatusEnum,
    paymentMethod: PaymentMethodEnum,
  })
  .refine(
    (data) => {
      // if paymentMethod is card, paymentIntent must not be undefined
      if (data.paymentMethod === "card") {
        return data.paymentIntent !== undefined;
      }
      if (data.products.length === 0) {
        return false;
      }
    },
    {
      message: "Invalid Invoice",
    },
  );

export const validateInvoice = (data: unknown) => {
  const result = InvoiceSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Invoice = z.infer<typeof InvoiceSchema> & Document;
