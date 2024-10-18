import { Request, Response } from "express";

import BaseController from "./init/BaseController";
import PaymentService from "../services/PaymentService";

import { ProductDTO } from "../libs/zod/dto/ProductDTO";
import {
  CheckoutProductDTO,
  validateCheckoutProductDTO,
} from "../libs/zod/dto/CheckoutProductDTO";
import ServiceFactory from "../services/init/ServiceFactory";

export default class PaymentController extends BaseController {
  private readonly paymentService: PaymentService =
    ServiceFactory.createService("payment") as PaymentService;
  /**
   * create a payment intent for the transaction
   * @param req request containing transaction data
   * @param res response containing client secret
   */
  public override async post(req: Request, res: Response): Promise<void> {
    this.checkReqBody(req, res);
    try {
      const products = Array.isArray(req.body.products)
        ? req.body.products
        : [req.body.products];

      const checkoutProducts: CheckoutProductDTO[] = products.map(
        (product: ProductDTO) => {
          return validateCheckoutProductDTO(product);
        },
      );

      console.log(checkoutProducts);

      if (checkoutProducts.length === 0) {
        res.status(502).send({ error: "Unexpected checkout error" });
        return;
      }

      const clientSecret =
        await this.paymentService.createPaymentIntent(checkoutProducts);

      if (!clientSecret) {
        res.status(502).send({ error: "no payment intent created" });
      } else res.status(201).send({ clientSecret: clientSecret });
    } catch (error) {
      this.error(error, res);
    }
  }
}
