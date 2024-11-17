import { Product } from "../../../libs/zod/model/Product";
import { Filter } from "../../../libs/zod/Filter";

import { DeleteResult, ObjectId } from "mongodb";
import SessionService from "../../../Base/SessionService";
import { ProductDTO, validateProductDTO } from "../../../libs/zod/dto/ProductDTO";
import productsModel from "../Models/productsModel";
import { PipelineStage } from "mongoose";

export default class ProductService extends SessionService {
  public constructor() {
    super();
  }

  // Get the list of products by the list of product ids
  async findProductsList(ids: ObjectId[]): Promise<Product[]> {
    const products = await productsModel.find({ _id: { $in: ids } }).lean();
    return products;
  }

  async findMany(filter: Filter): Promise<ProductDTO[] | null> {
    const products = await productsModel
      .find({
        status: true,
        quantity: { $gte: 1 },
      })
      .sort({ [filter.sort]: filter.order })
      .skip(filter.skip)
      .limit(filter.limit)
      .lean();

    // console.log(products);

    return products.map(validateProductDTO);
  }

  public async search(filter: Filter): Promise<ProductDTO[] | null> {
    const order = filter.order === "asc" || filter.order === "ascending" ? 1 : -1;

    const aggregationPipeline: PipelineStage[] = [];

    // Add a $search stage if query name is provided
    if (filter.query) {
      aggregationPipeline.push({
        $search: {
          index: "product_name",
          text: {
            query: filter.query,
            path: "name",
            fuzzy: { maxEdits: 2 },
          },
        },
      });
    }

    // Add a $match stage to filter by type if filter.type is provided
    if (filter.type) {
      aggregationPipeline.push({
        $match: { type: filter.type },
      });
    }

    // Add a $match stage to filter by status and quantity
    aggregationPipeline.push({
      $match: {
        status: true,
        quantity: { $gte: 1 },
      },
    });

    aggregationPipeline.push(
      { $sort: { [filter.sort]: order } },
      { $limit: filter.limit },
      { $skip: filter.skip }
    );

    const products: Product[] = await productsModel.aggregate(aggregationPipeline);

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

  public async updateById(id: ObjectId, data: Partial<Product>): Promise<Product | null> {
    await this.startSession();
    this.startTransaction();
    try {
      // Add updated_at field to the data object
      data.updated_at = new Date();
      const updateStatus = await productsModel.findOneAndUpdate(
        { _id: id },
        data,
        this.getSession()
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
      const deleteResult = await productsModel.deleteOne({ _id: id }, this.getSession());

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
