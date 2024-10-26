import { Filter } from "../../../libs/zod/Filter";

export default interface IFindMany<K> {
  findMany(filter?: Filter): Promise<K[] | null>;
}
