import { z } from "zod";

export const PhoneSchema = z.string().transform((val) => {
  // Check for alphabetic characters
  if (/[a-zA-Z]/.test(val)) {
    throw new Error("Phone number must not contain alphabetic characters");
  }
  // Allow digits, +, (), -, and whitespace
  const phone = val.replace(/[^\d+() -]/g, "");
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");
  // Check length of digits only
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    throw new Error("Invalid phone number");
  }
  return phone;
});
