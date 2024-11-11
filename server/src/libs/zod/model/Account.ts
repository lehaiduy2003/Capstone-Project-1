import { Document } from "mongoose";
import { z } from "zod";
import { RecyclerFieldSchema } from "../RecyclerField";
import { PasswordSchema } from "../Password";
import RoleEnum from "../enums/Role";
import AccountStatusEnum from "../enums/AccountStatus";

const AccountSchema = z
  .object({
    email: z.string().trim().email({ message: "Invalid email address" }),
    password: PasswordSchema,
    role: RoleEnum,
    created_at: z.date().default(new Date()),
    updated_at: z.date().default(new Date()),
    is_verified: z.boolean().default(false),
    status: AccountStatusEnum,
    recycler_field: RecyclerFieldSchema.optional(),
    joined_campaigns: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.role === "recycler") {
        return data.recycler_field !== undefined && data.recycler_field !== null;
      }
      return true;
    },
    {
      message: "recyclerField is required when role is recycler",
      path: ["recyclerField"],
    }
  );

export const validateAccount = (data: unknown) => {
  const result = AccountSchema.safeParse(data);

  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type Account = z.infer<typeof AccountSchema> & Document;
