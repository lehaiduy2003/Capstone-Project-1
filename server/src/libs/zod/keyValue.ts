import { z } from "zod";
import { Types } from "mongoose";

// Define the schema for keyValue
const keyValueSchema = z.union([
  z.object({}),
  z.string(),
  z.number(),
  z.boolean(),
  z.instanceof(Types.ObjectId),
]);

// Example usage
export const validateKeyValue = (value: unknown) => {
  const result = keyValueSchema.safeParse(value);
  if (!result.success) {
    throw new Error("Invalid keyValue");
  }
  return result.data;
};

export type keyValue = z.infer<typeof keyValueSchema>;
