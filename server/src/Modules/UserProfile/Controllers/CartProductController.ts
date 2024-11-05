import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import BaseController from "../../../Base/BaseController";
import CartProductService from "../Services/CartProductService";

export default class CartProductController extends BaseController {
  private readonly cartProductsService: CartProductService;

  constructor(cartProductService: CartProductService) {
    super();
    this.cartProductsService = cartProductService;
  }

  async addProduct(req: Request, res: Response) {
    if (!this.checkReqParams(req, res)) return;
    try {
      const userId = new ObjectId(String(req.params.userId));
      const productId = new ObjectId(String(req.body.productId));
      const quantity = Number(req.body.quantity);

      // console.log(userId, productId, quantity);
      const isAdded = await this.cartProductsService.addProduct(userId, productId, quantity);
      if (!isAdded) {
        res.status(400).send("Failed to add product to cart");
        return;
      }

      res.status(200).send("Product added to cart");
    } catch (error) {
      this.error(error, res);
    }
  }

  async removeProduct(req: Request, res: Response) {
    if (!this.checkReqBody(req, res) || !this.checkReqParams(req, res)) return;
    try {
      const userId = new ObjectId(String(req.params.userId));
      const productId = new ObjectId(String(req.body.productId));

      const isRemoved = await this.cartProductsService.removeProduct(userId, productId);
      if (!isRemoved) {
        res.status(400).send("Failed to remove product from cart");
        return;
      }

      res.status(200).send("Product removed from cart");
    } catch (error) {
      this.error(error, res);
    }
  }

  async clearCart(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      const userId = new ObjectId(String(req.params.userId));

      const isCleared = await this.cartProductsService.clearCart(userId);
      if (!isCleared) {
        res.status(400).send("Failed to clear the cart");
        return;
      }

      res.status(200).send("Cart cleared");
    } catch (error) {
      this.error(error, res);
    }
  }

  async getCart(req: Request, res: Response) {
    if (!this.checkReqParams(req, res)) return;
    try {
      const userId = new ObjectId(String(req.params.userId));
      const cart = await this.cartProductsService.getProducts(userId);

      res.status(200).send(cart);
    } catch (error) {
      this.error(error, res);
    }
  }
}
