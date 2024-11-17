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
      const user_id = new ObjectId(String(req.body.user_id));
      const productId = new ObjectId(String(req.params.productId));

      // console.log(userId, productId);

      const wishList = await this.wishListService.updateProduct(user_id, productId);
      if (!wishList) {
        res.status(400).send({ message: "Failed to add product to wish list" });
        return;
      }

      res.status(200).send(wishList);
    } catch (error) {
      this.error(error, res);
    }
  }

  async removeProduct(req: Request, res: Response) {
    if (!this.checkReqBody(req, res) || !this.checkReqParams(req, res)) return;
    try {
      const user_id = new ObjectId(String(req.body.user_id));
      const product_id = new ObjectId(String(req.params.productId));

      const wishList = await this.wishListService.removeProduct(user_id, product_id);
      if (!wishList) {
        res.status(400).send({ message: "Failed to remove product from wish list" });
        return;
      }

      res.status(200).send(wishList);
    } catch (error) {
      this.error(error, res);
    }
  }

  async getWishList(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      const user_id = new ObjectId(String(req.body.user_id));
      const wishList = await this.wishListService.getProducts(user_id);
      if (wishList.data.length === 0) {
        res.status(200).send({ message: "wish list is empty" });
        return;
      }

      res.status(200).send(wishList);
    } catch (error) {
      this.error(error, res);
    }
  }

  async setWishList(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      const user_id = new ObjectId(String(req.body.user_id));
      const products = req.body.wishList;
      if (products.length === 0) {
        res.status(400).send({ message: "Can not update wish list to empty" });
        return;
      }

      const updatedWishList = await this.wishListService.setProducts(user_id, products);
      if (!updatedWishList) {
        res.status(502).send({ message: "Failed to update wish list" });
        return;
      }
      res.status(200).send({ message: "Wish list updated" });
    } catch (error) {
      this.error(error, res);
    }
  }
}
