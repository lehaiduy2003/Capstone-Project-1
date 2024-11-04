import { z } from "zod";

const TransactionStatusEnum = z
  .enum(["pending", "shipping", "completed", "refunded"])
  .default("pending");

export default TransactionStatusEnum;
