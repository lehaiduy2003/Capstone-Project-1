import { z } from "zod";
import { Types } from "mongoose";

// Define the schema for keyValue
const keyValueSchema = z.union([z.object({}), z.string(), z.number(), z.boolean(), z.instanceof(Types.ObjectId)]);

// Example usage
export const validateKeyValue = (value: unknown) => {
  const result = keyValueSchema.safeParse(value);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type KeyValue = z.infer<typeof keyValueSchema>;
