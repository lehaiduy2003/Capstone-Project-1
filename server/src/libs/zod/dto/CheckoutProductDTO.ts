import { z } from "zod";

const CheckoutProductDTOSchema = z.object({
  price: z.number(),
  quantity: z.number(),
});

export const validateCheckoutProductDTO = (data: unknown) => {
  const result = CheckoutProductDTOSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type CheckoutProductDTO = z.infer<typeof CheckoutProductDTOSchema>;
