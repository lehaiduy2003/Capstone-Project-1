import { z } from "zod";

/**
 * Naming rule:
 * `no upper case`
 * `single word only`
 */
export const ServiceModelTypeSchema = z.enum([
  "account",
  "user",
  "payment",
  "product",
  "transaction",
  "activities",
  "recycle",
  "auth",
]);

export const validateServiceModelType = (data: unknown) => {
  const result = ServiceModelTypeSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type ServiceModelType = z.infer<typeof ServiceModelTypeSchema> &
  Document;
