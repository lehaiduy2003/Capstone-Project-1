import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

const UserProfileDTOSchema = z.object({
  _id: ObjectIdSchema,
  name: z.string(),
  avatar: z.string().url({ message: "avatar must be an url" }),
  followers: z.number().optional(),
  following: z.number().optional(),
  address: z.array(z.string()).max(1), // for get only 1 address of user profile
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
