import { Product, validateProduct } from "../libs/zod/model/Product";
import { Filter, validateFilter } from "../libs/zod/Filter";

import { ObjectId } from "mongodb";
import SessionService from "./init/SessionService";
import { ProductDTO, validateProductDTO } from "../libs/zod/dto/ProductDTO";
import productsModel from "../models/productsModel";

export default class ProductService extends SessionService {
  public constructor() {
    super();
  }
  async read(filter: Partial<Filter>): Promise<ProductDTO[] | null> {
    const parsedFilter = validateFilter(filter);
    const products = await productsModel
      .find()
      .sort({ [parsedFilter.sort]: parsedFilter.order })
      .skip(parsedFilter.skip)
      .limit(parsedFilter.limit);

    // console.log(products);

    return products.map(validateProductDTO).filter((product) => product);
  }

  public async search(filter: Partial<Filter>): Promise<ProductDTO[] | null> {
    const parsedFilter = validateFilter(filter);

    const order = parsedFilter.order === "asc" || parsedFilter.order === "ascending" ? 1 : -1;

    const products = await productsModel.aggregate([
      {
        $search: {
          index: "product_name",
          text: {
            query: parsedFilter.query,
            path: "name",
            fuzzy: { maxEdits: 1 },
          },
        },
      },
      { $sort: { [parsedFilter.sort]: order } },
      { $limit: parsedFilter.limit },
      { $skip: parsedFilter.skip },
    ]);

    // console.log(products);

    return products.map(validateProductDTO);
  }

  public async createProduct(data: Partial<Product>): Promise<Product | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const productData = validateProduct(data);
      const product = new productsModel(productData);

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

  public async updateProductById(id: string, data: Partial<Product>): Promise<Product> {
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

  public async deleteProduct(id: string): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      const objectId = new ObjectId(id);
      // Delete the product
      const deleteStatus = await productsModel.deleteOne({ _id: objectId }, this.getSession());

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

  public async readOne(id: string): Promise<Product | null> {
    return await productsModel.findOne({ _id: new ObjectId(id) });
  }
}
