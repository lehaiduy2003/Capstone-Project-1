import { z } from "zod";
import ObjectIdSchema from "../ObjectId";
import { DobSchema } from "../DateTransformer";
import { PhoneSchema } from "../PhoneTransformer";

const UserProfileDTOSchema = z.object({
  _id: ObjectIdSchema,
  name: z.string(),
  avatar: z.string().url({ message: "avatar must be an url" }),
  phone: PhoneSchema.optional(),
  followers: z.number().optional(),
  following: z.number().optional(),
  reputation_score: z.number().default(100),
  gender: z.boolean().default(true),
  dob: DobSchema.optional(),
  bio: z.string(),
  joined_campaigns: z.array(ObjectIdSchema).default([]),
  address: z.array(z.string()), // for get only 1 address of user profile
  account_id: ObjectIdSchema,
});

export const validateUserProfileDTO = (data: unknown) => {
  const result = UserProfileDTOSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type UserProfileDTO = z.infer<typeof UserProfileDTOSchema>;
