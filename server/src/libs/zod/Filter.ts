import { FilterQuery } from "mongoose";
import { z } from "zod";

export const SortOrderSchema = z.union([
  z.enum(["asc", "ascending", "desc", "descending", "1", "-1"]),
  z.number().refine((val) => val === -1 || val === 1, {
    message: "Number must be -1 or 1",
  }),
]);

export const FilterSchema = z.object({
  query: z.string().optional(),
  sort: z.enum(["createdAt", "price"]).optional().default("createdAt"),
  orderBy: SortOrderSchema.optional().default(1),
  limit: z.number().optional().default(10),
  skip: z.number().optional().default(0),
  page: z.number().optional().default(1),
});

export const validateFilter = (data: unknown) => {
  const result = FilterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type Filter = z.infer<typeof FilterSchema> & FilterQuery<unknown>;
