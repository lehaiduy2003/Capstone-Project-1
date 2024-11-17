import { z } from "zod";

const SortEnum = z.enum(["updated_at", "price"]).default("updated_at");

export default SortEnum;
