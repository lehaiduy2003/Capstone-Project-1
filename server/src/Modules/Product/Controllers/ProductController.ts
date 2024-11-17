import { Request, Response } from "express";

import BaseController from "../../../Base/BaseController";
import ProductService from "../Services/ProductService";
import saveToCache from "../../../libs/redis/cacheSaving";
import { validateFilter } from "../../../libs/zod/Filter";
import { Product, validateProduct, validateProductUpdate } from "../../../libs/zod/model/Product";
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
    try {
      const parsedFilter = validateFilter(req.query);
      const products = await this.productService.findMany(parsedFilter);

      if (!products || products.length === 0) {
        res.status(404).send({ message: "No products found" });
      } else {
        await saveToCache(req.body.cacheKey, 3600, products);
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

      await saveToCache(req.body.cacheKey, 3600, products);

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
      await saveToCache(req.body.cacheKey, 3600, product);
      res.status(200).send(product);
    } catch (error) {
      this.error(error, res);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const productData = validateProduct(req.body);

      const product = await this.productService.create(productData);

      if (!product) {
        res.status(502).send({ message: "Product not created" });
        return;
      }

      res.status(201).send(product);
    } catch (error) {
      this.error(error, res);
    }
  }

  async updateById(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const id = new ObjectId(req.params.id);
      const productData = validateProductUpdate(req.body.product);
      if (productData.owner || productData.created_at || productData.updated_at) {
        res.status(403).send({ message: "You can not update owner, created_at, or updated_at" });
        return;
      }

      const product = await this.productService.findById(id);
      if (!product) {
        res.status(404).send({ message: "Updated product not found" });
        return;
      }

      if (product.owner.toString() !== String(req.body.user_id)) {
        res.status(403).send({ message: "You can not update other user's product" });
        return;
      }

      const isUpdated = await this.productService.updateById(id, productData);

      if (!isUpdated) {
        res.status(502).send({ message: "Product not updated" });
        return;
      }

      res.status(200).send({ message: "Product updated" });
    } catch (error) {
      this.error(error, res);
    }
  }

  public async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const id = new ObjectId(req.params.id);
      const isDeleted = await this.productService.delete(id); // Delete product

      if (!isDeleted) {
        res.status(404).json({ message: "No products found" });
      } else {
        res.status(200).json({ message: "Product deleted" });
      }
    } catch (error) {
      this.error(error, res);
    }
  }
}
