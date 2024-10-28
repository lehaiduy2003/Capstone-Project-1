import {z} from "zod";
import {Types, Document} from "mongoose";

const FollowSchema = z.object({
    user_id: z
        .union([z.string(), z.instanceof(Types.ObjectId)])
        .refine((val) => Types.ObjectId.isValid(val.toString()), {
            message: "Invalid ObjectId",
        })
        .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
    following: z.object({
        _id: z
            .union([z.string(), z.instanceof(Types.ObjectId)])
            .refine((val) => Types.ObjectId.isValid(val.toString()), {
                message: "Invalid ObjectId",
            })
            .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
        name: z.string(),
        avatar: z.string().url(),
        followedAt: z.date().default(new Date()),
    }),
});

export const validateFollower = (data: unknown) => {
    const result = FollowSchema.safeParse(data);
    if (!result.success) {
        throw new Error(result.error.errors[0].message);
    }
    return result.data;
};

export type Follow = z.infer<typeof FollowSchema> & Document
