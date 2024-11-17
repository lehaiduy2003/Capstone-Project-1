import { z } from "zod";

const CheckoutProductDTOSchema = z.object({
  price: z.number({ message: "price must be a number" }),
  quantity: z
    .number({ message: "quantity must be a number" })
    .int({ message: "quantity must be an integer" })
    .positive({ message: "quantity can not negative" }),
});

export const validateCheckoutProductDTO = (data: unknown) => {
  const result = CheckoutProductDTOSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type CheckoutProductDTO = z.infer<typeof CheckoutProductDTOSchema>;
