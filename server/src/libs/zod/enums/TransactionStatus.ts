import { z } from "zod";

const TransactionStatusEnum = z
  .enum(["pending", "delivering", "completed", "refunded"])
  .default("pending");

export default TransactionStatusEnum;
