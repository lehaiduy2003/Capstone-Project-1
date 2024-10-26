import { ClientSession } from "mongoose";

export default interface ICreate<T> {
  create(data: Partial<T>, session?: ClientSession): Promise<Partial<T> | null>;
}
