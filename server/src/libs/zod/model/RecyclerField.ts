import { z } from "zod";

// for using user profile model
export const RecyclerFieldSchema = z.object({
  recyclingLicenseNumber: z.string(),
  recyclingCapacity: z.number(),
});

export const validateRecyclerField = (data: unknown) => {
  const result = RecyclerFieldSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type RecyclerField = z.infer<typeof RecyclerFieldSchema>;
