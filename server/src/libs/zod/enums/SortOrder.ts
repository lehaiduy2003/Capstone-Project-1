import { z } from "zod";

const SortOrderEnum = z.enum(["asc", "desc", "ascending", "descending"]).default("asc");

export default SortOrderEnum;
