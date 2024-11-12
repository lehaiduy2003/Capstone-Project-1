import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import BaseController from "../../../Base/BaseController";
import CartService from "../Services/CartService";

export default class CartController extends BaseController {
  private readonly cartService: CartService;

  constructor(cartService: CartService) {
    super();
    this.cartService = cartService;
  }

  async updateProduct(req: Request, res: Response) {
    if (!this.checkReqParams(req, res)) return;
    try {
      const userId = new ObjectId(String(req.body.id));
      const productId = new ObjectId(String(req.body.productId));
      const quantity = Number(req.body.quantity);

      // console.log(userId, productId, quantity);
      const updatedStatus = await this.cartService.updateProduct(userId, productId, quantity);
      if (!updatedStatus) {
        res.status(502).send({ message: "Failed to update product to cart" });
        return;
      }

      res.status(200).send({ message: "Product updated to cart" });
    } catch (error) {
      this.error(error, res);
    }
  }

  async removeProduct(req: Request, res: Response) {
    if (!this.checkReqBody(req, res) || !this.checkReqParams(req, res)) return;
    try {
      const userId = new ObjectId(String(req.body.id));
      const productId = new ObjectId(String(req.params.productId));

      const isRemoved = await this.cartService.removeProduct(userId, productId);
      if (!isRemoved) {
        res.status(400).send({ message: "Failed to remove product from cart" });
        return;
      }

      res.status(200).send({ message: "Product removed from cart" });
    } catch (error) {
      this.error(error, res);
    }
  }

  async setCart(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      const userId = new ObjectId(String(req.body.id));
      const cart = req.body.cart;
      // console.log(userId, cart);

      const updatedCart = await this.cartService.setProducts(userId, cart);
      if (!updatedCart) {
        res.status(502).send({ message: "Failed to update cart" });
        return;
      }

      res.status(200).send({ message: "Cart updated" });
    } catch (error) {
      this.error(error, res);
    }
  }

  async getCart(req: Request, res: Response) {
    if (!this.checkReqParams(req, res)) return;
    try {
      const userId = new ObjectId(String(req.body.id));
      // console.log(userId);

      const products = await this.cartService.getProducts(userId);

      if (!products) {
        res.status(200).send({ message: "Cart is empty" });
        return;
      }

      res.status(200).send(products);
    } catch (error) {
      this.error(error, res);
    }
  }
}
