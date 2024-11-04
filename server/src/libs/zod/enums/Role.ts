import { z } from "zod";

const RoleEnum = z.enum(["customer", "admin", "recycler"]).default("customer");

export default RoleEnum;
