import { z } from "zod";
import { PasswordSchema } from "../Password";
import { PhoneSchema } from "../PhoneTransformer";

const AdminCreateUserDTOSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: PasswordSchema,
  name: z.string().min(3).max(50),
  phone: PhoneSchema,
  address: z.array(z.string()).min(1),
  role: z.enum(["customer", "recycler"]),
  status: z.enum(["active", "inactive"]).default("active"),
});

export const validateAdminCreateUserDTO = (data: unknown) => {
  const result = AdminCreateUserDTOSchema.safeParse(data);

  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type AdminCreateUserDTO = z.infer<typeof AdminCreateUserDTOSchema>;
