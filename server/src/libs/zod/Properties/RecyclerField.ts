import {z} from "zod";

export const RecyclerFieldSchema = z.object({
    license: z.array(z.string()),
});

export type RecyclerField = z.infer<typeof RecyclerFieldSchema>;
