import { z } from "zod";

const TransactionStatusEnum = z.enum([
  "pending",
  "transporting",
  "delivering",
  "completed",
  "refunded",
]);

export default TransactionStatusEnum;
