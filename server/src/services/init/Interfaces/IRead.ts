import { Filter } from "../../../libs/zod/Filter";
import { keyValue } from "../../../libs/zod/keyValue";

export default interface IRead<T> {
  read(filter?: Filter, field?: keyof T, keyValue?: keyValue): Promise<Partial<T>[] | null>;
}
