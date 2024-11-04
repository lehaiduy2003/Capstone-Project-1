import { z } from "zod";

const PaymentMethodEnum = z.enum(["card", "cash"]).default("cash");

export default PaymentMethodEnum;
