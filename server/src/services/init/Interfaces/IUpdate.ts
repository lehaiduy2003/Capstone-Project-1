import { ClientSession } from "mongoose";
import { keyValue } from "../../../libs/zod/keyValue";

export default interface IUpdate<T> {
  update(field: keyof T, keyValue: keyValue, data: Partial<T>, session?: ClientSession): Promise<boolean>;
}
