import { Document, Types } from "mongoose";
import { z } from "zod";

export const ActivitySchema = z.object({
  date: z.date().default(new Date()),
  log: z.string(),
  actor: z.object({
    _id: z
      .union([z.string(), z.instanceof(Types.ObjectId)])
      .refine((val) => Types.ObjectId.isValid(val.toString()), {
        message: "Invalid ObjectId",
      })
      .transform((val) =>
        typeof val === "string" ? new Types.ObjectId(val) : val,
      ),
    role: z.enum(["customer", "admin", "recycler"]),
  }),
});

export const validateActivity = (data: unknown) => {
  const result = ActivitySchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Activity = z.infer<typeof ActivitySchema> & Document;
export interface IActivity extends Document, Activity {}
