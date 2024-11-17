import { z } from "zod";
import { Types } from "mongoose";

// ObjectIdSchema is a union of string and Types.ObjectId
// It is used for validating and transforming ObjectId
// If the input is a string, it will be transformed to Types.ObjectId
// If the input is Types.ObjectId, it will be kept as is
const ObjectIdSchema = z
  .union([z.string(), z.instanceof(Types.ObjectId)])
  .refine((val) => Types.ObjectId.isValid(val.toString()), {
    message: "Invalid ObjectId",
  })
  .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val));

export const validateObjectId = (data: unknown) => {
  const result = ObjectIdSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export default ObjectIdSchema;
