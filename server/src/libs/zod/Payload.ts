import { JwtPayload } from "jsonwebtoken";
import { z } from "zod";

const PayloadSchema = z.object({
  sub: z.string(),
  role: z.string().optional(),
  iat: z.number({ message: "issue at must be a number (UNIX timestamp)" }),
  exp: z.number({ message: "expired must be a number (UNIX timestamp)" }),
  aud: z.string().optional(),
  iss: z.string().optional(),
});

export const validatePayload = (data: unknown) => {
  const result = PayloadSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type Payload = z.infer<typeof PayloadSchema> & JwtPayload;
