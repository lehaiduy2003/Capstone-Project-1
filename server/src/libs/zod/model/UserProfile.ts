import { z } from "zod";
import generateRandomString from "../../crypto/randomString";
import { Document } from "mongoose";
import ObjectIdSchema from "../ObjectId";
import { CartDTOSchema } from "../dto/CartDTO";
import { WishListDTOSchema } from "../dto/WishListDTO";

const UserProfileSchema = z.object({
  name: z.string().default(generateRandomString()),
  phone: z.string().optional(),
  avatar: z
    .string()
    .url({ message: "avatar must be an url" })
    .default("https://static-00.iconduck.com/assets.00/avatar-default-icon-1975x2048-2mpk4u9k.png"),
  dob: z.date().default(new Date()),
  bio: z.string().default(""),
  gender: z.boolean().default(true), // male: 1 - female: 0
  address: z.array(z.string()).default([]),
  reputation_score: z.number({ message: "score must be a number" }).default(100),
  followers: z
    .number({ message: "followers count must be a number" })
    .int({ message: "followers count must be an integer" })
    .default(0),
  following: z
    .number({ message: "following count must be a number" })
    .int({ message: "following count must be an integer" })
    .default(0),
  account_id: ObjectIdSchema,
  cart: CartDTOSchema.default([]),
  wish_list: WishListDTOSchema.default([]),
  joined_campaigns: z.array(ObjectIdSchema).default([]),
});

export const validateUserProfile = (data: unknown) => {
  const result = UserProfileSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type UserProfile = z.infer<typeof UserProfileSchema> & Document;
