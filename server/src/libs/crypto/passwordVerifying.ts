import { pbkdf2Sync } from "crypto";
/**
 * Verifies the data against the hash
 * @param {string} password - data to verify (input by the user) e.g. password, email, etc...
 * @param {string} salt - salt of the data (from the database)
 * @param {string} hash - hash of the data (from the database)
 * @returns {boolean} - true if the data is correct, false otherwise
 */
export default function verifyPassword(password: string, salt: string, hash: string) {
  const hashToVerify = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hashToVerify === hash;
}
