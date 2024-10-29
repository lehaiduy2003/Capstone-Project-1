import { z } from "zod";

export const PasswordSchema = z.string().refine(
  (password) => {
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const isLongEnough = password.length >= 6;
    return hasNumber && hasLetter && isLongEnough;
  },
  {
    message: "Password must contain both numbers and letters and be longer than 12 characters.",
  }
);
