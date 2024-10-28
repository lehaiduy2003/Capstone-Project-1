import {Document, Types} from "mongoose";
import {z} from "zod";

const RecycleCampaignSchema = z.object({
    name: z.string(),
    img: z.string().url(),
    description_content: z.string().default(""),
    description_imgs: z.array(z.string().url()).default([]),
    recycledWeight: z.number().nonnegative().default(0),
    recycledAmount: z.number().nonnegative().default(0),
    participants: z.number().nonnegative().default(0),
    guide: z.string().url().default(""),
    location: z.array(z.string()).default([]),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
    owner: z
        .union([z.string(), z.instanceof(Types.ObjectId)])
        .refine((val) => Types.ObjectId.isValid(val.toString()), {
            message: "Invalid ObjectId",
        })
        .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
    status: z.boolean().default(true),
});

export const validateRecycleCampaign = (data: unknown) => {
    const result = RecycleCampaignSchema.safeParse(data);
    if (!result.success) {
        throw result.error;
    }
    return result.data;
};

export type RecycleCampaign = z.infer<typeof RecycleCampaignSchema> & Document;
