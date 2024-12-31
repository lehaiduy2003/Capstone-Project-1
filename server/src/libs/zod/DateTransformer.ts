import { z } from "zod";

// Custom date transformer to handle DD-MM-YYYY format
const dateTransformer = z.union([
  z.string().transform((str) => {
    const datePattern = /^\d{2}-\d{2}-\d{4}$/;
    if (!datePattern.test(str)) {
      throw new Error("Invalid date format, expected DD-MM-YYYY");
    }

    const [day, month, year] = str.split("-");
    const date = new Date(`${year}-${month}-${day}`);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    return date;
  }),
  z.date().max(new Date()),
]);

export const DobSchema = dateTransformer.refine((date) => date <= new Date(), {
  message: "Date must be in the past",
});
