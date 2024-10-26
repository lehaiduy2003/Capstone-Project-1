import { FilterQuery } from "mongoose";
import { z } from "zod";

const FilterSchema = z.object({
  query: z.string().optional(),
  sort: z.enum(["updatedAt", "price"]).optional().default("updatedAt"),
  order: z.enum(["asc", "ascending", "desc", "descending"]).default("asc"),
  limit: z.preprocess((val) => {
    const num = Number(val);
    return isNaN(num) ? 10 : num > 100 ? 100 : num;
  }, z.number().optional().default(10)),
  skip: z.preprocess((val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num < 0 ? 0 : num;
  }, z.number().optional().default(0)),
});

export const validateFilter = (data: unknown) => {
  const result = FilterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Filter = z.infer<typeof FilterSchema> & FilterQuery<unknown>;
