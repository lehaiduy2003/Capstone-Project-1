import { Document } from "mongoose";
import { z } from "zod";
import { PasswordSchema } from "../Password";
import AccountStatusEnum from "../enums/AccountStatus";
import { Role } from "../enums/Role";

const AccountSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: PasswordSchema,
  role: Role.default("customer"),
  created_at: z.date().default(new Date()),
  updated_at: z.date().default(new Date()),
  is_verified: z.boolean().default(false),
  status: AccountStatusEnum.default("active"),
});

export const validateAccount = (data: unknown) => {
  const result = AccountSchema.safeParse(data);

  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type Account = z.infer<typeof AccountSchema> & Document;
