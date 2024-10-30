import { Product } from "../../../libs/zod/model/Product";
import { Filter } from "../../../libs/zod/Filter";

import { DeleteResult, ObjectId } from "mongodb";
import SessionService from "../../../Base/SessionService";
import {
  ProductDTO,
  validateProductDTO,
} from "../../../libs/zod/dto/ProductDTO";
import productsModel from "../Models/productsModel";

export default class ProductService extends SessionService {
  public constructor() {
    super();
  }

  async findMany(filter: Filter): Promise<ProductDTO[] | null> {
    const products = await productsModel
      .find()
      .sort({ [filter.sort]: filter.order })
      .skip(filter.skip)
      .limit(filter.limit)
      .lean();

    // console.log(products);

    return products.map(validateProductDTO);
  }

  public async search(filter: Filter): Promise<ProductDTO[] | null> {
    const order =
      filter.order === "asc" || filter.order === "ascending" ? 1 : -1;

    const products: ProductDTO[] = await productsModel.aggregate([
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
      { $sort: { [filter.sort]: order } },
      { $limit: filter.limit },
      { $skip: filter.skip },
    ]);

    // console.log(products);

    return products.map(validateProductDTO);
  }

  public async create(data: Partial<Product>): Promise<Product | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const product = new productsModel(data);

      await product.save({ session: this.getSession() });

      if (!product) {
        await this.abortTransaction();
        return null;
      }

      await this.commitTransaction();
      return product;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  public async updateById(
    id: ObjectId,
    data: Partial<Product>,
  ): Promise<Product | null> {
    await this.startSession();
    this.startTransaction();
    try {
      // Update the product
      const updateStatus = await productsModel.findOneAndUpdate(
        { _id: new ObjectId(id) },
        data,
        this.getSession(),
      );

      if (!updateStatus?.isModified) {
        await this.abortTransaction();
        return null;
      }

      await this.commitTransaction();
      return updateStatus;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  public async delete(id: ObjectId): Promise<DeleteResult | null> {
    await this.startSession();
    this.startTransaction();
    try {
      // Delete the product
      const deleteResult = await productsModel.deleteOne(
        { _id: id },
        this.getSession(),
      );

      if (deleteResult.deletedCount == 0) {
        await this.abortTransaction();
        return null;
      }

      await this.commitTransaction();
      return deleteResult;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  public async findById(id: ObjectId): Promise<Product | null> {
    return await productsModel.findOne({ _id: id }).lean();
  }
}
