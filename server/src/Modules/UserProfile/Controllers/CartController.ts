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
      const user_id = new ObjectId(String(req.body.user_id));
      const product_id = new ObjectId(String(req.body.product_id));
      const quantity = Number(req.body.quantity);

      // console.log(userId, productId, quantity);
      await this.cartService.checkAction(user_id, product_id);
      const cart = await this.cartService.updateProduct(user_id, product_id, quantity);
      if (!cart) {
        res.status(502).send({ success: false, message: "Failed to update product to cart" });
        return;
      }
      res.status(200).send(cart);
    } catch (error) {
      this.error(error, res);
    }
  }

  async removeProduct(req: Request, res: Response) {
    if (!this.checkReqBody(req, res) || !this.checkReqParams(req, res)) return;
    try {
      const user_id = new ObjectId(String(req.body.user_id));
      const product_id = new ObjectId(String(req.params.productId));

      await this.cartService.checkAction(user_id, product_id);

      const cart = await this.cartService.removeProduct(user_id, product_id);
      if (!cart) {
        res.status(400).send({ success: false, message: "Failed to remove product from cart" });
        return;
      }
      res.status(200).send(cart);
    } catch (error) {
      this.error(error, res);
    }
  }

  async setCart(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      const user_id = new ObjectId(String(req.body.user_id));
      const cart = req.body.cart;
      // console.log(userId, cart);

      const updatedCart = await this.cartService.setProducts(user_id, cart);
      if (!updatedCart) {
        res.status(502).send({ success: false, message: "Failed to update cart" });
        return;
      }

      res.status(200).send(updatedCart);
    } catch (error) {
      this.error(error, res);
    }
  }

  async getCart(req: Request, res: Response) {
    if (!this.checkReqParams(req, res)) return;
    try {
      const user_id = new ObjectId(String(req.body.user_id));
      // console.log(userId);

      const cart = await this.cartService.getProducts(user_id);
      if (cart.data.length === 0) {
        res.status(200).send({ success: false, message: "Cart is empty" });
        return;
      }
      res.status(200).send(cart);
    } catch (error) {
      this.error(error, res);
    }
  }
}
