import { FilterQuery } from "mongoose";
import { z } from "zod";
import SortOrderEnum from "./enums/SortOrder";
import SortEnum from "./enums/Sort";

const FilterSchema = z.object({
  query: z.string().optional(),
  sort: SortEnum,
  order: SortOrderEnum,
  limit: z.preprocess((val) => {
    const num = Number(val);
    return isNaN(num) ? 10 : num > 100 ? 100 : num;
  }, z.number().optional().default(10)),
  skip: z.preprocess((val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num < 0 ? 0 : num;
  }, z.number().optional().default(0)),
  type: z.string().optional(),
});

export const validateFilter = (data: unknown) => {
  const result = FilterSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type Filter = z.infer<typeof FilterSchema> & FilterQuery<unknown>;
