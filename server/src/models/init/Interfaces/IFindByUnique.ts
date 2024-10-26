export default interface IFindByUnique<K> {
  findByUnique(field: keyof K, keyValue: string): Promise<K | null>;
}
