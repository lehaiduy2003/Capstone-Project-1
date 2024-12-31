import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

const AuthDTOSchema = z.object({
  account_id: ObjectIdSchema,
  user_id: ObjectIdSchema,
  refreshToken: z.string(),
  accessToken: z.string(),
  role: z.string(),
});

export const validateAuthDTO = (data: unknown) => {
  const result = AuthDTOSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type AuthDTO = z.infer<typeof AuthDTOSchema>;
