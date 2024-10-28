import {Types} from "mongoose";
import {z} from "zod";
import {StatusSchema} from "../Properties/Status";

const TransactionUpdateDTOSchema = z.object({
    // transaction id
    _id: z
        .union([z.string(), z.instanceof(Types.ObjectId)])
        .refine((val) => Types.ObjectId.isValid(val.toString()), {
            message: "Invalid ObjectId",
        })
        .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
    user_id: z
        .union([z.string(), z.instanceof(Types.ObjectId)])
        .refine((val) => Types.ObjectId.isValid(val.toString()), {
            message: "Invalid ObjectId",
        })
        .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
    status: StatusSchema,
});

export const validateTransactionUpdateDTO = (data: unknown) => {
    const result = TransactionUpdateDTOSchema.safeParse(data);
    if (!result.success) {
        throw result.error;
    }
    return result.data;
};

export type TransactionUpdateDTO = z.infer<typeof TransactionUpdateDTOSchema>;
