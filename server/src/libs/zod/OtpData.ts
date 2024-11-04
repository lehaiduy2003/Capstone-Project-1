import { z } from "zod";
import { getCode } from "country-list";
import OtpEnum from "./enums/Otp";

const OtpSchema = z.object({
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
        },
      ),
  ]),
  type: OtpEnum,
});

export const validateOtp = (data: unknown) => {
  const result = OtpSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type OtpData = z.infer<typeof OtpSchema>;
