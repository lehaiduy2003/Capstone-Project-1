import { z } from "zod";
import generateRandomString from "../../crypto/randomString";
import { Document, Types } from "mongoose";

export const UserProfileSchema = z.object({
  name: z.string().default(generateRandomString()),
  phone: z.string().optional(),
  avatar: z
    .string()
    .url()
    .default(
      "https://static-00.iconduck.com/assets.00/avatar-default-icon-1975x2048-2mpk4u9k.png",
    ),
  dob: z.date().default(new Date()),
  bio: z.string().default(""),
  address: z.array(z.string()).default([]),
  reputationScore: z.number().default(0),
  followers: z.number().default(0),
  sold: z.number().default(0),
  bought: z.number().default(0),
  account_id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) =>
      typeof val === "string" ? new Types.ObjectId(val) : val,
    ),
  products: z
    .array(
      z
        .union([z.string(), z.instanceof(Types.ObjectId)])
        .refine((val) => Types.ObjectId.isValid(val.toString()), {
          message: "Invalid ObjectId",
        })
        .transform((val) =>
          typeof val === "string" ? new Types.ObjectId(val) : val,
        ),
    )
    .default([]),
  payments: z
    .array(
      z
        .union([z.string(), z.instanceof(Types.ObjectId)])
        .refine((val) => Types.ObjectId.isValid(val.toString()), {
          message: "Invalid ObjectId",
        })
        .transform((val) =>
          typeof val === "string" ? new Types.ObjectId(val) : val,
        ),
    )
    .default([]),
  cart: z
    .array(
      z.object({
        _id: z
          .union([z.string(), z.instanceof(Types.ObjectId)])
          .refine((val) => Types.ObjectId.isValid(val.toString()), {
            message: "Invalid ObjectId",
          })
          .transform((val) =>
            typeof val === "string" ? new Types.ObjectId(val) : val,
          ),
        img: z.string().url(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
      }),
    )
    .default([]),
  likes: z
    .array(
      z.object({
        _id: z
          .union([z.string(), z.instanceof(Types.ObjectId)])
          .refine((val) => Types.ObjectId.isValid(val.toString()), {
            message: "Invalid ObjectId",
          })
          .transform((val) =>
            typeof val === "string" ? new Types.ObjectId(val) : val,
          ),
        img: z.string().url(),
        name: z.string(),
        price: z.number(),
      }),
    )
    .default([]),
  following: z
    .array(
      z.object({
        _id: z
          .union([z.string(), z.instanceof(Types.ObjectId)])
          .refine((val) => Types.ObjectId.isValid(val.toString()), {
            message: "Invalid ObjectId",
          })
          .transform((val) =>
            typeof val === "string" ? new Types.ObjectId(val) : val,
          ),
        name: z.string(),
        avatar: z.string().url(),
      }),
    )
    .default([]),
});

export const validateUserProfile = (data: unknown) => {
  const result = UserProfileSchema.safeParse(data);
  if (!result.success) {
    console.error(result.error.errors);
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type UserProfile = z.infer<typeof UserProfileSchema> & Document;
export interface IUserProfile extends Document, UserProfile {}
