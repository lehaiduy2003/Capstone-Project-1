import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

// for using transaction DTO
export const TraderDTOSchema = z.object({
  _id: ObjectIdSchema,
  name: z.string(),
  address: z.string(),
  phone: z.string(),
});

export const validateTraderDTO = (data: unknown) => {
  const result = TraderDTOSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type TraderDTO = z.infer<typeof TraderDTOSchema>;
