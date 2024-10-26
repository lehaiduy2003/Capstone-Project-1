import { Document } from "mongoose";
import { z } from "zod";
import { RecyclerFieldSchema } from "./RecyclerField";

const passwordSchema = z.string().refine(
  (password) => {
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const isLongEnough = password.length >= 6;
    return hasNumber && hasLetter && isLongEnough;
  },
  {
    message: "Password must contain both numbers and letters and be longer than 12 characters.",
  }
);

const AccountSchema = z
  .object({
    email: z.string().trim().email({ message: "Invalid email address" }),
    password: passwordSchema,
    role: z
      .enum(["customer", "admin", "recycler"])
      .default("customer")
      .optional()
      .transform((role) => role ?? "customer"),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
    isVerified: z.boolean().default(false),
    status: z.enum(["active", "inactive"]).default("active"),
    recyclerField: RecyclerFieldSchema.optional(),
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
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Account = z.infer<typeof AccountSchema> & Document;
