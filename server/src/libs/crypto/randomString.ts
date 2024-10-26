import { randomBytes } from "crypto";

// for generate random default user name
export default function generateRandomString() {
  return randomBytes(8).toString("hex");
}
