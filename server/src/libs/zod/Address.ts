import {z} from "zod";
import countryList from "country-list";

const validCountryCodes = countryList.getCodes() as [string, ...string[]];

const AddressSchema = z.object({
    name: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.enum(validCountryCodes), // ISO 3166-1 alpha-2
})

export const validateAddress = (data: unknown) => {
    const result = AddressSchema.safeParse(data);
    if (!result.success) {
        throw result.error
    }
    return result.data;
}

export type Address = z.infer<typeof AddressSchema>;