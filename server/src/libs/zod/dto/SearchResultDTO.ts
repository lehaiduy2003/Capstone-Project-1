import { Types } from "mongoose";
import { z } from "zod";

export const SearchResultDTOSchema = z.object({
  _id: z
    .union([z.string(), z.instanceof(Types.ObjectId)])
    .refine((val) => Types.ObjectId.isValid(val.toString()), {
      message: "Invalid ObjectId",
    })
    .transform((val) =>
      typeof val === "string" ? new Types.ObjectId(val) : val,
    ),
  name: z.string(),
  img: z.string().url(),
  price: z.number(),
});

export const validateSearchResultDTO = (data: unknown) => {
  const result = SearchResultDTOSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
};

export type SearchResultDTO = z.infer<typeof SearchResultDTOSchema>;
