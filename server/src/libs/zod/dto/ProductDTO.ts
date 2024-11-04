import { Types } from "mongoose";
import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

// for using transaction DTO
export const ProductDTOSchema = z.object({
  _id: ObjectIdSchema,
  name: z.string(),
  img: z.string().url(),
  price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative().default(1).optional(),
  owner: ObjectIdSchema,
});

export const validateProductDTO = (data: unknown) => {
  const result = ProductDTOSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type ProductDTO = z.infer<typeof ProductDTOSchema>;
