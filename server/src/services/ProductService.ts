import ProductsModel from "../models/ProductsModel";

import { Product, validateProduct } from "../libs/zod/model/Product";
import { Filter, validateFilter } from "../libs/zod/Filter";

import { ObjectId } from "mongodb";
import SessionService from "./init/BaseService";
import { ProductDTO, validateProductDTO } from "../libs/zod/dto/ProductDTO";

export default class ProductService extends SessionService {
  private readonly productsModel: ProductsModel;
  public constructor(productsModel: ProductsModel) {
    super();
    this.productsModel = productsModel;
  }
  async read(filter: Partial<Filter>): Promise<Product[] | null> {
    const parsedFilter = validateFilter(filter);
    return await this.productsModel.findProducts(parsedFilter);
  }

  public async search(filter: Partial<Filter>): Promise<ProductDTO[] | null> {
    const parsedFilter = validateFilter(filter);
    const products = await this.productsModel.findSearchedProducts(parsedFilter);

    if (!products) {
      return null;
    }

    // const result = products.map(validateSearchResultDTO);

    // console.log(result);

    // return result;

    return products.map(validateProductDTO);
  }

  public async createProduct(data: Partial<Product>): Promise<Product | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const productData = validateProduct(data);
      const result = await this.productsModel.insert(productData, this.getSession());

      await this.commitTransaction();
      return result;
    } catch (error) {
      this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  public async updateProductById(id: string, data: Partial<Product>): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      // Validate input
      if (!id || !data) {
        await this.abortTransaction();
        throw new Error("Invalid input");
      }
      const objectId = new ObjectId(id);
      // Update the product
      const result = await this.productsModel.updateProductByUnique("_id", objectId, data, this.getSession());
      await this.commitTransaction();

      return result;
    } catch (error) {
      await this.abortTransaction();
      console.error(error);
      return false;
    } finally {
      await this.endSession();
    }
  }

  public async deleteProduct(id: string): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      if (!id) {
        await this.abortTransaction();
        throw new Error("Invalid input");
      }
      const objectId = new ObjectId(id);
      // Delete the product
      const result = await this.productsModel.deleteOne({ _id: objectId }, this.getSession());

      if (result.deletedCount === 0) {
        await this.abortTransaction();
        return false;
      }
<<<<<<< HEAD
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

=======

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

>>>>>>> develop
  public async readOne(id: string): Promise<Product | null> {
    return await this.productsModel.findProductByUnique("_id", new ObjectId(id));
  }
}
