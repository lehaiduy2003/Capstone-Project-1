import { z } from "zod";
import { Document } from "mongoose";
import generateRandomString from "../../crypto/randomString";

const ProductSchema = z.object({
  name: z.string().default(generateRandomString()),
  price: z.number(),
  img: z.string().url().default("https://static-00.iconduck.com/assets.00/avatar-default-icon-1975x2048-2mpk4u9k.png"),
  description: z.object({
    content: z.string(),
    imgs: z.array(z.string()).default([]),
  }),
  type: z.string(),
  status: z.boolean().default(true),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

export const validateProduct = (data: unknown) => {
  const result = ProductSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Product = z.infer<typeof ProductSchema> & Document;
