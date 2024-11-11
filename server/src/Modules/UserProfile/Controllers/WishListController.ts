import WishListService from "../Services/WishListService";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import BaseController from "../../../Base/BaseController";

export default class WishListController extends BaseController {
  private readonly wishListService: WishListService;

  constructor(wishListService: WishListService) {
    super();
    this.wishListService = wishListService;
  }

  async updateProduct(req: Request, res: Response) {
    if (!this.checkReqBody(req, res) || !this.checkReqParams(req, res)) return;
    try {
      const userId = new ObjectId(String(req.body.id));
      const productId = new ObjectId(String(req.params.productId));

      // console.log(userId, productId);

      const isAdded = await this.wishListService.updateProduct(userId, productId);
      if (!isAdded) {
        res.status(400).send({ message: "Failed to add product to wish list" });
        return;
      }

      res.status(200).send({ message: "Product added to wish list" });
    } catch (error) {
      this.error(error, res);
    }
  }

  async removeProduct(req: Request, res: Response) {
    if (!this.checkReqBody(req, res) || !this.checkReqParams(req, res)) return;
    try {
      const userId = new ObjectId(String(req.body.id));
      const productId = new ObjectId(String(req.params.productId));

      const isRemoved = await this.wishListService.removeProduct(userId, productId);
      if (!isRemoved) {
        res.status(400).send({ message: "Failed to remove product from wish list" });
        return;
      }

      res.status(200).send({ message: "Product removed from wish list" });
    } catch (error) {
      this.error(error, res);
    }
  }

  async getProducts(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      const userId = new ObjectId(String(req.body.id));
      const products = await this.wishListService.getProducts(userId);
      if (products.length === 0) {
        res.status(200).send({ message: "wish list is empty" });
        return;
      }

      res.status(200).send(products);
    } catch (error) {
      this.error(error, res);
    }
  }
}
