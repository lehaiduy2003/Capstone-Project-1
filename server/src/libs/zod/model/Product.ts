import { z } from "zod";
import { Document } from "mongoose";
import generateRandomString from "../../crypto/randomString";
import ObjectIdSchema from "../ObjectId";

const ProductSchema = z.object({
  name: z.string().default(generateRandomString()),
  price: z.number().nonnegative(),
  quantity: z.number().nonnegative().int().default(1), // nonnegative integer
  img: z
    .string()
    .url()
    .default("https://static-00.iconduck.com/assets.00/avatar-default-icon-1975x2048-2mpk4u9k.png"),
  description_content: z.string(),
  description_imgs: z.array(z.string().url()).optional(),
  type: z.string(),
  status: z.boolean().default(true),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
  owner: ObjectIdSchema,
});

export const validateProduct = (data: unknown) => {
  const result = ProductSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type Product = z.infer<typeof ProductSchema> & Document;
