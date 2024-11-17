import { z } from "zod";

const AccountStatusEnum = z.enum(["active", "inactive"]);

export default AccountStatusEnum;
