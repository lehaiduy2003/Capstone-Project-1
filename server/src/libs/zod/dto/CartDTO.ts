import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

const CartDTOSchema = z.array(
  z.object({
    _id: ObjectIdSchema,
    quantity: z.number().int().positive(),
  })
);

export const validateCartDTO = (cart: unknown) => {
  const result = CartDTOSchema.safeParse(cart);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type CartDTO = z.infer<typeof CartDTOSchema>;
