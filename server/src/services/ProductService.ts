import ProductsModel from "../models/ProductsModel";

import BaseService from "./init/BaseService";

import { Product } from "../libs/zod/model/Product";
import { Filter } from "../libs/zod/Filter";

import {
  SearchResultDTO,
  validateSearchResultDTO,
} from "../libs/zod/dto/SearchResultDTO";
import { ClientSession } from "mongoose";
import { keyValue } from "../libs/zod/keyValue";

export default class ProductService extends BaseService<
  ProductsModel,
  Product
> {
  override async read(
    field: keyof Product,
    keyValue: keyValue,
    filter: Filter,
  ): Promise<Product[] | null> {
    try {
      const products: Product[] | null =
        await this.getModel().findWithFilter(filter);

      return products;
    } catch (error) {
      console.error("Error getting homepage data:", error);
      throw error;
    }
  }
  create(
    data: Partial<Product>,
    session: ClientSession,
  ): Promise<Product | null> {
    throw new Error("Method not implemented.");
  }
  update(
    field: keyof Product,
    keyValue: keyValue,
    data: Partial<Product>,
    session: ClientSession,
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(
    field: keyof Product,
    keyValue: keyValue,
    session: ClientSession,
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public constructor() {
    super("product");
  }

  public async search(filter: Filter): Promise<SearchResultDTO[] | null> {
    const products: Product[] =
      await this.getModel().findSearchedProducts(filter);

    const result = products.map((product) => {
      return validateSearchResultDTO(product);
    });

    return result;
  }
}
