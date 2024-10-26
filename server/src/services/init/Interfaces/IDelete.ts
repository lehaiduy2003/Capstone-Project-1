import { ClientSession } from "mongoose";

export default interface IDelete<T> {
  delete(field: keyof T, keyValue: string, session?: ClientSession): Promise<boolean>;
}
