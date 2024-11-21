import { Filter } from "../../../libs/zod/Filter";
import { Product } from "../../../libs/zod/model/Product";
import productsModel from "../../Product/Models/productsModel";
import { DeleteResult, ObjectId } from "mongodb";
import ProductService from "../../Product/Services/ProductService";
import IProductService from "./init/IProductService";
export default class ProductOwnerService extends ProductService implements IProductService {
  public constructor() {
    super();
  }
  async findByOwner(ownerId: ObjectId, filter: Filter): Promise<Product[]> {
    return await productsModel
      .find({ owner: ownerId })
      .sort({ [filter.sort]: filter.order })
      .skip(filter.skip)
      .limit(filter.limit)
      .lean();
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
      const updateStatus = await productsModel.findOneAndUpdate({ _id: id }, data, {
        new: true,
        session: this.getSession(),
      });

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
}
