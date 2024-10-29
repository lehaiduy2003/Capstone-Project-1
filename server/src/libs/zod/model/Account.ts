import { Document } from "mongoose";
import { z } from "zod";
import { RecyclerFieldSchema } from "../Properties/RecyclerField";
import { PasswordSchema } from "../Properties/Password";

const AccountSchema = z
  .object({
    email: z.string().trim().email({ message: "Invalid email address" }),
    password: PasswordSchema,
    role: z
      .enum(["customer", "admin", "recycler"])
      .default("customer")
      .transform((role) => role ?? "customer"),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
    isVerified: z.boolean().default(false),
    status: z.enum(["active", "inactive"]).default("inactive"),
    recyclerField: RecyclerFieldSchema.optional(),
    joinedCampaigns: z.array(z.string()).default([]),
  })
  .refine(
    (data) => {
      if (data.role === "recycler") {
        return data.recyclerField !== undefined && data.recyclerField !== null;
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
