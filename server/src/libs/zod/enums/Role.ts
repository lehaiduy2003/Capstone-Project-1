import { z } from "zod";

const RoleEnum = z.enum(["customer", "admin", "recycler", "shipper"]);

export default RoleEnum;
