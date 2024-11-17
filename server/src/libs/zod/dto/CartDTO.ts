import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

// For using with UserProfilesModel
export const CartDTOSchema = z.array(
  z.object({
    _id: ObjectIdSchema,
    quantity: z
      .number({ message: "quantity must a number" })
      .int({ message: "quantity must be an integer" })
      .positive({ message: "quantity can not negative" }),
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
