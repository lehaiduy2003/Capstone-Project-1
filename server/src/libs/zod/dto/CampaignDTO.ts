import { z } from "zod";
import ObjectIdSchema from "../ObjectId";

// for using transaction DTO and other models
export const CampaignDTOSchema = z.object({
  _id: ObjectIdSchema,
  name: z.string(),
  img: z
    .string()
    .url({ message: "img must be an url" })
    .default(
      "https://t3.ftcdn.net/jpg/05/04/28/96/360_F_504289605_zehJiK0tCuZLP2MdfFBpcJdOVxKLnXg1.jpg"
    ),
  description_content: z.string().default(""),
  description_imgs: z
    .array(z.string().url({ message: "img must be an url" }))
    .default([
      "https://t3.ftcdn.net/jpg/05/04/28/96/360_F_504289605_zehJiK0tCuZLP2MdfFBpcJdOVxKLnXg1.jpg",
    ]),
  guide: z
    .string()
    .default(
      "https://t3.ftcdn.net/jpg/05/04/28/96/360_F_504289605_zehJiK0tCuZLP2MdfFBpcJdOVxKLnXg1.jpg"
    ),
  location: z.array(z.string()).default([]),
  created_at: z.date(),
  recycled_weight: z
    .number({ message: "weight must be a number" })
    .nonnegative({ message: "weight can not negative" })
    .default(0),
  recycled_amount: z
    .number({ message: "amount must be a number" })
    .nonnegative({ message: "amount can not negative" })
    .default(0),
  participants: z
    .number({ message: "participants must be a number" })
    .nonnegative({ message: "participants can not negative" })
    .default(0),
  creator_id: ObjectIdSchema,
});

export const validateCampaignDTO = (data: unknown) => {
  const result = CampaignDTOSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type CampaignDTO = z.infer<typeof CampaignDTOSchema>;
