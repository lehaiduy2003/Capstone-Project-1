import { z } from "zod";

export const Role = z.enum(["customer", "admin", "recycler"]);

export type RoleType = z.infer<typeof Role>;
