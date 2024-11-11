import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

const WishListDTOSchema = z.array(
  z.object({
    _id: ObjectIdSchema,
  })
);

export const validateWishListDTO = (data: unknown) => {
  const result = WishListDTOSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type WishListDTO = z.infer<typeof WishListDTOSchema>;
