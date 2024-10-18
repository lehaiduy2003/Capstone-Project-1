import { Request, Response } from "express";

import BaseController from "./init/BaseController";

import { validateTransactionUpdateDTO } from "../libs/zod/dto/TransactionUpdateDTO";
import { validateTransactionDTO } from "../libs/zod/dto/TransactionDTO";
import ServiceFactory from "../services/init/ServiceFactory";
import TransactionService from "../services/TransactionService";

export default class TransactionController extends BaseController {
  private readonly transactionService: TransactionService =
    ServiceFactory.createService("transaction") as TransactionService;

  /**
   * Not implemented
   * @param req
   * @param res
   */
  // TODO: Implement get method for get transactions history
  public override get(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  /**
   * for creating a transaction
   * @param req request containing transaction data (products, buyer, seller)
   * @param res response containing created transaction info
   */
  public override async post(req: Request, res: Response): Promise<void> {
    this.checkReqBody(req, res);
    try {
      const parsedTransaction = validateTransactionDTO(req.body);

      const transaction =
        await this.transactionService.create(parsedTransaction);

      if (!transaction)
        res.status(502).send({ message: "No transaction created" });
      else res.status(201).send(transaction);
    } catch (error) {
      this.error(error, res);
    }
  }
  /**
   * for updating a transaction data (restricted to updating status only)
   * @param req request containing transaction id and data to update (check if the user is authorized to update the transaction)
   * @param res response containing success message
   */
  public override async put(req: Request, res: Response): Promise<void> {
    this.checkReqBody(req, res);
    this.checkReqParams(req, res);
    try {
      const { id } = req.params;
      const parsedTransactionUpdateDTO = validateTransactionUpdateDTO({
        _id: id,
        ...req.body,
      });

      const updatedTransaction: boolean = await this.transactionService.update(
        "_id",
        parsedTransactionUpdateDTO._id,
        parsedTransactionUpdateDTO,
      );

      if (updatedTransaction === false)
        res.status(502).send({ message: "No transaction updated" });
      else
        res.status(200).send({ message: "Transaction updated successfully" });
    } catch (error) {
      this.error(error, res);
    }
  }
  /**
   * Not implemented
   * @param req
   * @param res
   */
  // TODO: Implement delete method for delete transaction history (only for transaction status = "cancelled" or "completed")
  public override delete(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
