import { DistanceUnitEnum, PaymentMethod, WeightUnitEnum } from "shippo";
import { z } from "zod";
import { PhoneSchema } from "./PhoneTransformer";

const AddressSchema = z.object({
  name: z.string(),
  city: z.string().optional(),
  country: z.string(),
  street1: z.string(),
  phone: PhoneSchema,
});

const ExtraSchema = z.object({
  cod: z
    .object({
      amount: z
        .string()
        .regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
      currency: z.enum(["USD", "VND"]).optional(),
      paymentMethod: z.nativeEnum(PaymentMethod).optional(),
    })
    .optional(),
  insurance: z
    .object({
      amount: z
        .string()
        .regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
      content: z.string().optional(),
      currency: z.enum(["USD", "VND"]).optional(),
      provider: z.enum(["FEDEX", "UPS", "ONTRAC"]).optional(),
    })
    .optional(),
});

const ParcelSchema = z.object({
  objectId: z.string().optional(),
  extra: ExtraSchema.optional(),
  label: z.string().optional(),
  length: z.string().regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
  width: z.string().regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
  height: z.string().regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
  distanceUnit: z.nativeEnum(DistanceUnitEnum),
  weight: z.string().regex(/^\d+(\.\d+)?$/, "Only digits and a single decimal point are allowed"),
  massUnit: z.nativeEnum(WeightUnitEnum),
});

export const validateShippoAddress = (data: unknown) => {
  try {
    const result = AddressSchema.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const validateParcels = (data: unknown) => {
  try {
    const result = ParcelSchema.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const validateExtra = (data: unknown) => {
  try {
    const result = ExtraSchema.safeParse(data);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  } catch (error) {
    throw error;
  }
};

export type ShippoAddress = z.infer<typeof AddressSchema>;
export type ShippoParcel = z.infer<typeof ParcelSchema>;
export type ShippoExtra = z.infer<typeof ExtraSchema>;
