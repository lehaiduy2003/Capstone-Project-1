import { z } from "zod";

const AccountStatusEnum = z.enum(["active", "inactive"]).default("inactive");

export default AccountStatusEnum;
