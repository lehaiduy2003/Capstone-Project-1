import { z } from "zod";
import { PasswordSchema } from "../Password";

const SignUpDTOSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: PasswordSchema,
  name: z.string().optional(),
  phone: z.string().min(10).max(15).optional(),
  address: z.string().optional(),
  role: z.enum(["customer", "recycler"]).default("customer"),
});

export const validateSignUpDTO = (data: unknown) => {
  const result = SignUpDTOSchema.safeParse(data);

  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type SignUpDTO = z.infer<typeof SignUpDTOSchema>;
