// import crypto from "crypto";

import { pbkdf2Sync, randomBytes } from "crypto";

const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");

  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

  return `${salt}:${hash}`;
};

export default hashPassword;
