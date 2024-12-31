import { z } from "zod";
import { DobSchema } from "../DateTransformer";
import { PhoneSchema } from "../PhoneTransformer";

const ProfileUpdatingDTOSchema = z.object({
  name: z.string(),
  avatar: z.string().url({ message: "avatar must be an url" }),
  phone: PhoneSchema.optional(),
  gender: z.boolean(),
  dob: DobSchema.optional(),
  bio: z.string().optional(),
  address: z.array(z.string()), // for get only 1 address of user profile
});

export const validateProfileUpdatingDTO = (data: unknown) => {
  const result = ProfileUpdatingDTOSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type ProfileUpdatingDTO = z.infer<typeof ProfileUpdatingDTOSchema>;
