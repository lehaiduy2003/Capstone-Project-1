import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

// for using transaction DTO and other models
export const ProductDTOSchema = z.object({
  _id: ObjectIdSchema,
  name: z.string(),
  img: z.string().url({ message: "img must be an url" }),
  price: z
    .number({ message: "price must be a number" })
    .nonnegative({ message: "price can not negative" }),
  quantity: z
    .number({ message: "quantity must be a number" })
    .int({ message: "quantity must be an integer" })
    .nonnegative({ message: "quantity can not negative" }),
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
