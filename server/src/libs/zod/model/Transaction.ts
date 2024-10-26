import { z } from "zod";
import { Document, Types } from "mongoose";

export const PaymentMethodSchema = z.enum(["cash", "card"]).default("cash");
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const PaymentStatusSchema = z.enum(["pending", "paid"]).default("pending");
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const StatusSchema = z.enum(["pending", "shipping", "completed", "refunded"]).default("pending");
export type Status = z.infer<typeof StatusSchema>;

const TransactionSchema = z.object({
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
  buyer: z.object({
    _id: z
      .union([z.string(), z.instanceof(Types.ObjectId)])
      .refine((val) => Types.ObjectId.isValid(val.toString()), {
        message: "Invalid ObjectId",
      })
      .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
    address: z.string(),
    phone: z.string(),
    name: z.string(),
  }),
  seller: z.object({
    _id: z
      .union([z.string(), z.instanceof(Types.ObjectId)])
      .refine((val) => Types.ObjectId.isValid(val.toString()), {
        message: "Invalid ObjectId",
      })
      .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
    address: z.string(),
    phone: z.string(),
    name: z.string(),
  }),
  products: z.array(
    z.object({
      _id: z
        .union([z.string(), z.instanceof(Types.ObjectId)])
        .refine((val) => Types.ObjectId.isValid(val.toString()), {
          message: "Invalid ObjectId",
        })
        .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
      name: z.string(),
      img: z.string().url(),
      price: z.number(),
      quantity: z.number(),
    })
  ),
  paymentMethod: PaymentMethodSchema,
  paymentStatus: PaymentStatusSchema,
  shippingFee: z.number().default(30000),
  status: StatusSchema,
  user_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
});

export const validateTransaction = (data: unknown) => {
  const result = TransactionSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Transaction = z.infer<typeof TransactionSchema> & Document;
