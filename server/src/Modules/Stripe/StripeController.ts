import { Request, Response } from "express";

import BaseController from "../../Base/BaseController";
import parseProducts from "../../utils/parsedProducts";
import StripeService from "./StripeService";
import { ObjectId } from "mongodb";

export default class StripeController extends BaseController {
  private readonly stripeService: StripeService;

  public constructor(stripeService: StripeService) {
    super();
    this.stripeService = stripeService;
  }

  /**
   * create a payment intent for the transaction
   * @param req request containing transaction data
   * @param res response containing client secret
   */
  public async createPaymentIntent(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      // console.log("req.body.id", req.body.id);
      const parsedProducts = parseProducts(req.body.products);
      const clientSecret = await this.stripeService.createPaymentIntent(
        new ObjectId(String(req.body.id)), // id of the user
        parsedProducts
      );

      if (!clientSecret) {
        res.status(502).send({ message: "no payment intent created" });
      } else res.status(201).send({ clientSecret: clientSecret });
    } catch (error) {
      this.error(error, res);
    }
  }
}
