import { createHash } from "crypto";

export const SECRET_ENCODED = createHash("sha256")
  .update(`${process.env.SECRET_KEY}`)
  .digest("base64");
