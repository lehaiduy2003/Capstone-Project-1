import { z } from "zod";

export const CheckoutProductDTOSchema = z.object({
  price: z.number(),
  quantity: z.number(),
});

export const validateCheckoutProductDTO = (data: unknown) => {
  const result = CheckoutProductDTOSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type CheckoutProductDTO = z.infer<typeof CheckoutProductDTOSchema>;
