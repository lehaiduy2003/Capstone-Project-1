import {Types} from "mongoose";
import {z} from "zod";

const UserProfileDTOSchema = z.object({
    _id: z
        .union([z.string(), z.instanceof(Types.ObjectId)])
        .refine((val) => Types.ObjectId.isValid(val.toString()), {
            message: "Invalid ObjectId",
        })
        .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
    name: z.string(),
    avatar: z.string().url(),
    followers: z.number().optional(),
    following: z.number().optional(),
    address: z.array(z.string()).max(1), // for get only 1 address of user profile
    account_id: z
        .union([z.string(), z.instanceof(Types.ObjectId)]).refine((val) => Types.ObjectId.isValid(val.toString()), {
            message: "Invalid ObjectId",
        })
        .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
});

export const validateUserProfileDTO = (data: unknown) => {
    const result = UserProfileDTOSchema.safeParse(data);
    if (!result.success) {
        throw result.error;
    }
    return result.data;
};

export type UserProfileDTO = z.infer<typeof UserProfileDTOSchema>;
