import { z } from "zod";

const PaymentStatusEnum = z.enum(["unpaid", "paid"]).default("unpaid");

export default PaymentStatusEnum;
