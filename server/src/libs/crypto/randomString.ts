import { randomBytes } from "crypto";

// for generate random default user name
const generateRandomString = (): string => {
  return randomBytes(8).toString("hex");
};

export default generateRandomString;
