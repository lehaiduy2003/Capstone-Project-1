import { Address } from "../../../../libs/zod/Address";
import { Product } from "../../../../libs/zod/model/Product";

export default interface ITrackingService {
  createDelivery(addressFrom: Address, addressTo: Address): void;
}
