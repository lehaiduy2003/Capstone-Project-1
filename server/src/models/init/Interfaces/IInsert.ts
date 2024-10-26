import { ClientSession } from "mongoose";

export default interface IInsert<K> {
  insert(data: Partial<K>, session?: ClientSession): Promise<Partial<K> | null>;
}
