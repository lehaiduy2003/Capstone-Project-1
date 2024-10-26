import { Product } from "../libs/zod/model/Product";
import { Filter } from "../libs/zod/Filter";
import { FilterQuery, ClientSession, Model, model } from "mongoose";
import { KeyValue } from "../libs/zod/KeyValue";
import { ObjectId } from "mongodb";
import productsSchema from "./schemas/ProductsSchema";

export default class ProductsModel {
  private readonly model: Model<Product>;
  public constructor() {
    this.model = model<Product>("products", productsSchema);
  }

  async insert(data: Partial<Product>, session: ClientSession): Promise<Product | null> {
    const modelInstance = new this.model(data);
    return await modelInstance.save({ session });
  }

  public async findSearchedProducts(filter: Filter): Promise<Product[]> {
    return await this.model.aggregate([
      {
        $search: {
          index: "product_name",
          text: {
            query: filter.query,
            path: "name",
            fuzzy: { maxEdits: 1 },
          },
        },
      },
      { $sort: { [filter.sort]: filter.order === "asc" ? 1 : -1 } },
      { $limit: filter.limit },
      { $skip: filter.skip },
    ]);
  }

  /**
   * Finds documents with a filter.
   * @param filter - The filter to apply.
   * @param field - An optional unique field to match.
   * @param keyValue - An optional value of the unique field.
   * @returns A promise that resolves to an array of documents, or null if the operation failed.
   */
  async findProducts(filter: Filter, field?: keyof Product, keyValue?: KeyValue): Promise<Product[] | null> {
    const filterQuery: FilterQuery<Product> = field && keyValue ? ({ [field]: keyValue } as FilterQuery<Product>) : {};
    return await this.model
      .find(filterQuery)
      .sort({ [filter.sort]: filter.order } as FilterQuery<Product>)
      .limit(filter.limit)
      .skip(filter.skip);
  }

  /**
   * Finds a document by a unique field.
   * @param field - The unique field to match.
   * @param keyValue - The value of the unique field.
   * @returns A promise that resolves to the found document, or null if no document was found.
   */
  async findProductByUnique(field: keyof Product, keyValue: KeyValue): Promise<Product | null> {
    return await this.model.findOne({ [field]: keyValue } as FilterQuery<Product>);
  }

  async updateProductByUnique(
    field: string,
    keyValue: ObjectId,
    data: Partial<Product>,
    session: ClientSession
  ): Promise<boolean> {
    const result = await this.model.updateOne({ [field]: keyValue }, { $set: data }, { session });
    return result.modifiedCount > 0;
  }

  async deleteOne(filter: FilterQuery<Product>, session: ClientSession): Promise<{ deletedCount: number }> {
    const result = await this.model.deleteOne(filter, { session });
    return { deletedCount: result.deletedCount };
  }
}
