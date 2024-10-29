import { Product } from "../libs/zod/model/Product";
import { Filter } from "../libs/zod/Filter";

import { ObjectId } from "mongodb";
import SessionService from "./init/SessionService";
import { ProductDTO, validateProductDTO } from "../libs/zod/dto/ProductDTO";
import productsModel from "../models/productsModel";

export default class ProductService extends SessionService {
  public constructor() {
    super();
  }
  async read(filter: Filter): Promise<ProductDTO[] | null> {
    const products = await productsModel
      .find()
      .sort({ [filter.sort]: filter.order })
      .skip(filter.skip)
      .limit(filter.limit);

    // console.log(products);

    return products.map(validateProductDTO).filter((product) => product);
  }

  public async search(filter: Filter): Promise<ProductDTO[] | null> {
    const order = filter.order === "asc" || filter.order === "ascending" ? 1 : -1;

    const products = await productsModel.aggregate([
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

  public async createProduct(data: Partial<Product>): Promise<Product | null> {
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
      this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  public async updateProductById(id: ObjectId, data: Partial<Product>): Promise<Product> {
    await this.startSession();
    this.startTransaction();
    try {
      // Update the product
      const updateStatus = await productsModel.findOneAndUpdate(
        { _id: new ObjectId(id) },
        data,
        this.getSession()
      );

      if (!updateStatus?.isModified) {
        await this.abortTransaction();
        throw new Error("Update failed");
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

  public async deleteProduct(id: ObjectId): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      // Delete the product
      const deleteStatus = await productsModel.deleteOne({ _id: id }, this.getSession());

      if (deleteStatus.deletedCount == 0) {
        await this.abortTransaction();
        return false;
      }

      await this.commitTransaction();
      return true;
    } catch (error) {
      await this.abortTransaction();
      console.error(error);
      // Return failure
      return false;
    } finally {
      await this.endSession();
    }
  }

  public async readOne(id: ObjectId): Promise<Product | null> {
    return await productsModel.findOne({ _id: id });
  }
}
