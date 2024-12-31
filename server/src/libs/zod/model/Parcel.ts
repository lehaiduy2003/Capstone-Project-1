import { z } from "zod";
import ObjectIdSchema from "../ObjectId";
import { Document } from "mongoose";
import { DistanceUnitEnum, WeightUnitEnum } from "shippo";

const ParcelSchema = z.object({
  _id: ObjectIdSchema,
  user_id: ObjectIdSchema,
  label: z.string().optional(),
  extra: z
    .object({
      cod: z.object({
        amount: z
          .string()
          .regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
        currency: z.enum(["USD", "VND"]),
        paymentMethod: z.enum(["SECURED_FUNDS", "ANY", "CASH"]),
      }),
      insurance: z
        .object({
          amount: z
            .string()
            .regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
          content: z.string(),
          currency: z.enum(["USD", "VND"]),
          provider: z.enum(["FEDEX", "UPS", "ONTRAC"]),
        })
        .optional(),
    })
    .optional(),
  parcel_type: z.enum(["parcel", "letter", "recycle"]).default("parcel").optional(),
  parcel_id: z.string(),
  mass_unit: z.nativeEnum(WeightUnitEnum),
  weight: z.string().regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
  distance_unit: z.nativeEnum(DistanceUnitEnum),
  height: z.string().regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
  length: z.string().regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
  width: z.string().regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
  metadata: z.string(),
});

export const validateParcel = (data: unknown) => {
  const result = ParcelSchema.safeParse(data);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
};

export type Parcel = z.infer<typeof ParcelSchema> & Document;
