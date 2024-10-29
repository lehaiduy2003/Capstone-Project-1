import { z } from "zod";
import { PasswordSchema } from "./Properties/Password";
import { getCode } from "country-list";

const OtpSchema = z.object({
  otp: z.string().length(5).optional(), // for sending otp, it is optional, but for verifying otp, it is required
  identifier: z.union([
    z.string().email(),
    z
      .string()
      .regex(/^\+\d{1,3}\d{4,14}$/)
      .refine(
        (val) => {
          const countryCode = val.match(/^\+(\d{1,3})/);
          return countryCode ? getCode(countryCode[1]) !== undefined : false;
        },
        {
          message: "Invalid country code",
        }
      ),
  ]),
  password: PasswordSchema.optional(), // for forgot password, it is optional, but for signup, it is required
  type: z.enum(["forgot", "password", "activate"]),
});

export const validateOtp = (data: unknown) => {
  const result = OtpSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type OtpData = z.infer<typeof OtpSchema>;
