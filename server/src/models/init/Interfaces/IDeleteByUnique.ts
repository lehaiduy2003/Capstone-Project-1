import { ClientSession } from "mongoose";
import { keyValue } from "../../../libs/zod/keyValue";

export default interface IDeleteByUnique<K> {
  deleteByUnique(field: keyof K, keyValue: keyValue, session?: ClientSession): Promise<boolean>;
}
