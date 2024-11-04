import { z } from "zod";

const OtpEnum = z.enum(["forgot", "activate", "deactivate"]);

export default OtpEnum;
