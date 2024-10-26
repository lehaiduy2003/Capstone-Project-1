import { Filter } from "../../../libs/zod/Filter";
import { keyValue } from "../../../libs/zod/keyValue";

export default interface IFindWithFilter<K> {
  findWithFilter(filter: Filter, field?: keyof K, keyValue?: keyValue): Promise<K[] | null>;
}
