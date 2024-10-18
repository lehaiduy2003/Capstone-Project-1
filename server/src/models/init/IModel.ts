import { ClientSession } from "mongoose";
import { keyValue } from "../../libs/zod/keyValue";

export default interface IModel<K> {
  // search
  findAll(): Promise<any[] | null>;
  findByUnique(field: keyof K, keyValue: keyValue): Promise<Partial<K> | null>;
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update
  updateByUnique(field: keyof K, keyValue: keyValue, data: Partial<K>, session: ClientSession): Promise<boolean>;
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // delete
  deleteByUnique(field: keyof K, keyValue: keyValue, session: ClientSession): Promise<boolean>;
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  // insert
  insert(data: Partial<K>, session: ClientSession): Promise<Partial<K> | null>;
}
