import { ClientSession } from "mongoose";
import { keyValue } from "../../../libs/zod/keyValue";

export default interface IUpdateByUnique<K> {
  updateByUnique(field: keyof K, keyValue: keyValue, data: Partial<K>, session: ClientSession): Promise<boolean>;
}
