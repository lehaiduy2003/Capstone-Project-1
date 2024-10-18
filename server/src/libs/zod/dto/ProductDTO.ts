import { Types } from "mongoose";
import { z } from "zod";

export const ProductDTOSchema = z.object({
  _id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) =>
      typeof val === "string" ? new Types.ObjectId(val) : val,
    ),
  name: z.string(),
  img: z.string().url(),
  price: z.number(),
  quantity: z.number(),
});

export const validateProductDTO = (data: unknown) => {
  const result = ProductDTOSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type ProductDTO = z.infer<typeof ProductDTOSchema>;
