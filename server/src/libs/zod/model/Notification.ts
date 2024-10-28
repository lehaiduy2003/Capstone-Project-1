import {z} from "zod";
import {Types, Document} from "mongoose";

export const NotificationSchema = z.object({
    account_id: z
        .union([z.string(), z.instanceof(Types.ObjectId)])
        .refine((val) => Types.ObjectId.isValid(val.toString()), {
            message: "Invalid ObjectId",
        })
        .transform((val) => (typeof val === "string" ? new Types.ObjectId(val) : val)),
    title: z.string(),
    date: z.date(),
    content: z.string(),
});

export const validateNotification = (data: unknown) => {
    const result = NotificationSchema.safeParse(data);
    if (!result.success) {
        throw new Error(result.error.errors[0].message);
    }
    return result.data;
};

export type Notification = z.infer<typeof NotificationSchema> & Document;