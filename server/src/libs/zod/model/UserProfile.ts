import { z } from "zod";
import generateRandomString from "../../crypto/randomString";
import { Document } from "mongoose";
import ObjectIdSchema from "../ObjectId";
import { ProductDTOSchema } from "../dto/ProductDTO";

const UserProfileSchema = z.object({
  name: z.string().default(generateRandomString()),
  phone: z.string().optional(),
  avatar: z
    .string()
    .url()
    .default("https://static-00.iconduck.com/assets.00/avatar-default-icon-1975x2048-2mpk4u9k.png"),
  dob: z.date().default(new Date()),
  bio: z.string().default(""),
  gender: z.boolean().default(true), // male: 1 - female: 0
  address: z.array(z.string()).default([]),
  reputationScore: z.number().default(100),
  followers: z.number().int().default(0),
  following: z.number().int().default(0),
  account_id: ObjectIdSchema,
  cart: z.array(ProductDTOSchema).default([]),
  likes: z
    .array(
      z.object({
        _id: ObjectIdSchema,
        img: z.string().url(),
        name: z.string(),
        price: z.number(),
        owner: ObjectIdSchema,
      })
    )
    .default([]),
  joinedCampaigns: z.array(ObjectIdSchema).default([]),
});

export const validateUserProfile = (data: unknown) => {
  const result = UserProfileSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type UserProfile = z.infer<typeof UserProfileSchema> & Document;
