import { Request, Response } from "express";

import BaseController from "./init/BaseController";
import PaymentService from "../services/PaymentService";

export default class PaymentController extends BaseController {
  private readonly paymentService: PaymentService;
  public constructor(paymentService: PaymentService) {
    super();
    this.paymentService = paymentService;
  }
  /**
   * create a payment intent for the transaction
   * @param req request containing transaction data
   * @param res response containing client secret
   */
  public async createPaymentIntent(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const clientSecret = await this.paymentService.createPaymentIntent(req.body.products);

      if (!clientSecret) {
        res.status(502).send({ error: "no payment intent created" });
      } else res.status(201).send({ clientSecret: clientSecret });
    } catch (error) {
      this.error(error, res);
    }
  }
}
