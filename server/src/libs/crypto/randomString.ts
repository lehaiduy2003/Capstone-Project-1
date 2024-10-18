import crypto from "crypto";
// for generate random default user name
export default function generateRandomString() {
  return crypto.randomBytes(8).toString("hex");
}
