import { Request, Response } from "express";
import ProductOwnerService from "../Services/ProductOwnerService";
import { validateProduct, validateProductUpdate } from "../../../libs/zod/model/Product";
import BaseController from "../../../Base/BaseController";
import { ObjectId } from "mongodb";
import { validateFilter } from "../../../libs/zod/Filter";
export default class ProductOwnerController extends BaseController {
  private readonly productOwnerService: ProductOwnerService;
  constructor(productOwnerService: ProductOwnerService) {
    super();
    this.productOwnerService = productOwnerService;
  }
  async findByOwner(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = new ObjectId(String(req.body.user_id));
      const filter = validateFilter(req.query);
      const products = await this.productOwnerService.findByOwner(ownerId, filter);

      if (!products || products.length === 0) {
        res.status(404).send({ message: "No products found" });
        return;
      }

      res.status(200).send(products);
    } catch (error) {
      this.error(error, res);
    }
  }
  async create(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const productData = validateProduct(req.body);

      const product = await this.productOwnerService.create(productData);

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
      const id = new ObjectId(req.params.productId);
      const productData = validateProductUpdate(req.body.product);
      if (productData.owner || productData.created_at || productData.updated_at) {
        res.status(403).send({ message: "You can not update owner, created_at, or updated_at" });
        return;
      }

      const product = await this.productOwnerService.findById(id);
      if (!product) {
        res.status(404).send({ message: "Updating product not found" });
        return;
      }

      if (product.owner.toString() !== String(req.body.user_id)) {
        res.status(403).send({ message: "You can not update other user's product" });
        return;
      }

      const isUpdated = await this.productOwnerService.updateById(id, productData);

      if (!isUpdated) {
        res.status(502).send({ success: true, message: "Product not updated" });
        return;
      }

      res.status(200).send(isUpdated);
    } catch (error) {
      this.error(error, res);
    }
  }

  public async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const id = new ObjectId(req.params.productId);
      const product = await this.productOwnerService.findById(id);
      if (!product) {
        res.status(404).send({ message: "Deleting product not found" });
        return;
      }
      if (product.owner.toString() !== String(req.body.user_id)) {
        res.status(403).send({ message: "You can not deleting other user's product" });
        return;
      }
      const isDeleted = await this.productOwnerService.delete(id); // Delete product

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
