import { Address } from "../../../../libs/zod/Address";
import { Transaction } from "../../../../libs/zod/model/Transaction";

export default interface ITrackingService {
  createDelivery(order: Transaction): Promise<boolean>;
}
