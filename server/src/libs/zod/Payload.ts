import { JwtPayload } from "jsonwebtoken";
import { z } from "zod";

const PayloadSchema = z.object({
  sub: z.string(),
  role: z.string().optional(),
  iat: z.number(),
  exp: z.number(),
  aud: z.string().optional(),
  iss: z.string().optional(),
});

export const validatePayload = (data: unknown) => {
  const result = PayloadSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Payload = z.infer<typeof PayloadSchema> & JwtPayload;
