import { z } from "zod";

const SortEnum = z.enum(["updatedAt", "price"]).default("updatedAt");

export default SortEnum;
