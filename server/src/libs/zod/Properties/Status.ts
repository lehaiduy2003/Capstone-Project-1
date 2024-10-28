import {z} from "zod";

export const StatusSchema = z.enum(["pending", "shipping", "completed", "refunded"]).default("pending");
