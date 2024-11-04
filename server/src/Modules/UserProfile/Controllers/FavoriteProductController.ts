import FavoriteProductService from "../Services/FavoriteProductService";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import BaseController from "../../../Base/BaseController";

export default class FavoriteProductController extends BaseController {
  private readonly likedProductsService: FavoriteProductService;

  constructor(likedProductsService: FavoriteProductService) {
    super();
    this.likedProductsService = likedProductsService;
  }

  async addProduct(req: Request, res: Response) {
    if (!this.checkReqBody(req, res) || !this.checkReqParams(req, res)) return;
    try {
      const userId = new ObjectId(String(req.body._id));
      const productId = new ObjectId(String(req.params.productId));

      const isAdded = await this.likedProductsService.addProduct(
        userId,
        productId,
      );
      if (!isAdded) {
        res.status(400).send("Failed to add product to favorite list");
        return;
      }

      res.status(200).send("Product added to favorite list");
    } catch (error) {
      this.error(error, res);
    }
  }

  async removeProduct(req: Request, res: Response) {
    if (!this.checkReqBody(req, res) || !this.checkReqParams(req, res)) return;
    try {
      const userId = new ObjectId(String(req.body._id));
      const productId = new ObjectId(String(req.params.productId));

      const isRemoved = await this.likedProductsService.removeProduct(
        userId,
        productId,
      );
      if (!isRemoved) {
        res.status(400).send("Failed to remove product from favorite list");
        return;
      }

      res.status(200).send("Product removed from favorite list");
    } catch (error) {
      this.error(error, res);
    }
  }
}
