import { keyValue } from "../../libs/zod/keyValue";
import { Filter } from "../../libs/zod/Filter";
import { ClientSession } from "mongoose";

export default interface IService<T> {
  create(data: Partial<T>, session?: ClientSession): Promise<Partial<T> | null>;
  read(
    field: keyof T,
    keyValue: keyValue,
    filter: Filter,
  ): Promise<Partial<T>[] | null>;
  update(
    field: keyof T,
    keyValue: keyValue,
    data: Partial<T>,
    session?: ClientSession,
  ): Promise<boolean>;
  delete(
    field: keyof T,
    keyValue: keyValue,
    session?: ClientSession,
  ): Promise<boolean>;
}
