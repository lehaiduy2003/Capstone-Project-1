import { Product } from "../../../../libs/zod/model/Product";
import { DeleteResult, ObjectId } from "mongodb";
export default interface IProductService {
  create(data: Partial<Product>): Promise<Product | null>;

  updateById(id: ObjectId, data: Partial<Product>): Promise<Product | null>;

  delete(id: ObjectId): Promise<DeleteResult | null>;
}
