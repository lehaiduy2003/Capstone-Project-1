import { Request, Response } from "express";

import BaseController from "../../../Base/BaseController";
import ProductService from "../Services/ProductService";
import saveToCache from "../../../libs/redis/cacheSaving";
import { validateFilter } from "../../../libs/zod/Filter";
import queryString from "querystring";
import { ObjectId } from "mongodb";
import { validateObjectId } from "../../../libs/zod/ObjectId";

export default class ProductController extends BaseController {
  private readonly productService: ProductService;

  public constructor(productService: ProductService) {
    super();
    this.productService = productService;
  }

  /**
   * get products (for no search query params (sort, order, find by, etc.) provided by user - homepage, user products, etc.)
   * @param req request containing query params (limit, skip, page)
   * @param res response containing products
   */
  public async findMany(req: Request, res: Response): Promise<void> {
    if (!this.checkReqQuery(req, res)) return;
    const query = req.query;
    try {
      const parsedFilter = validateFilter(query);
      const products = await this.productService.findMany(parsedFilter);

      if (!products || products.length === 0) {
        res.status(404).send({ success: false, message: "No products found" });
      } else {
        await saveToCache(req.body.cacheKey, 30, products); // save to cache for 30 seconds
        res.status(200).send(products);
      }
    } catch (error) {
      this.error(error, res);
    }
  }

  public async findProductList(req: Request, res: Response): Promise<void> {
    if (!this.checkReqQuery(req, res)) return;
    try {
      const url = req.originalUrl;
      // console.log(url);
      const parsedQuery = queryString.parse(url.split("?")[1]);
      const ids = Array.isArray(parsedQuery.id) ? parsedQuery.id : [parsedQuery.id];
      console.log(ids);

      const validatedIds = ids
        .filter((productId): productId is string => typeof productId === "string")
        .map((productId: string) => validateObjectId(productId));

      const products = await this.productService.findProductsList(validatedIds);

      if (!products || products.length === 0) {
        res.status(404).send({ message: "No products found" });
        return;
      } else {
        res.status(200).send(products);
      }
    } catch (error) {
      this.error(error, res);
    }
  }

  /**
   * for searching products based on query params (sort, order, find by, etc.)
   * @param req request containing query params (limit, skip, page, sort, order, find by, etc.)
   * @param res response containing products
   */
  async search(req: Request, res: Response): Promise<void> {
    if (!this.checkReqQuery(req, res)) return;
    try {
      const parsedFilter = validateFilter(req.query);

      const products = await this.productService.search(parsedFilter);

      if (!products || products.length === 0) {
        res.status(404).send({ message: "No products found" });
        return;
      }

      await saveToCache(req.body.cacheKey, 300, products); // save to cache for 300 seconds

      res.status(200).send(products);
    } catch (error) {
      this.error(error, res);
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    if (!this.checkReqParams) return;
    try {
      const id = new ObjectId(req.params.id);

      const product = await this.productService.findById(id);

      if (!product) {
        res.status(404).send({ message: "Product not found" });
        return;
      }
      await saveToCache(req.body.cacheKey, 10, product); // save to cache for 10 seconds
      res.status(200).send(product);
    } catch (error) {
      this.error(error, res);
    }
  }
}
