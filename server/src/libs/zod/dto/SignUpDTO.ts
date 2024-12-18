import { z } from "zod";
import { PasswordSchema } from "../Password";
import { RecyclerFieldSchema } from "../RecyclerField";

const SignUpDTOSchema = z
  .object({
    email: z.string().email({ message: "Invalid email" }),
    password: PasswordSchema,
    role: z.enum(["customer", "recycler"]).default("customer"),
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

export const validateSignUpDTO = (data: unknown) => {
  const result = SignUpDTOSchema.safeParse(data);

  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type SignUpDTO = z.infer<typeof SignUpDTOSchema>;
