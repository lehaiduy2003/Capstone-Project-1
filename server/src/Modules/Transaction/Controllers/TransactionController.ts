import { Request, Response } from "express";

import BaseController from "../../../Base/BaseController";

import TransactionService from "../Services/TransactionService";
import { ObjectId } from "mongodb";
import { validateTransaction } from "../../../libs/zod/model/Transaction";
import { validateObjectId } from "../../../libs/zod/ObjectId";
import { validateFilter } from "../../../libs/zod/Filter";
import { validateProductDTO } from "../../../libs/zod/dto/ProductDTO";
import { validateTransactionDTO } from "../../../libs/zod/dto/TransactionDTO";

// TODO: Implement delete method for delete transaction history (only for transaction status = "cancelled" or "completed")
export default class TransactionController extends BaseController {
  private readonly transactionService: TransactionService;

  public constructor(transactionService: TransactionService) {
    super();
    this.transactionService = transactionService;
  }

  /**
   * for creating a transaction
   * @param req request containing transaction data (products, buyer, seller)
   * @param res response containing created transaction info
   */
  public async create(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const data = req.body.products;
      // console.log(data);

      const metaData = req.body.metadata; // shipping address, payment method, etc
      // console.log(metaData);
      const user_id = validateObjectId(req.body.user_id);

      const products = Array.isArray(data)
        ? data.map((product) => {
            return validateTransaction({
              user_id: user_id,
              total: product.price * product.quantity,
              product: validateProductDTO(product),
              ...metaData,
            });
          })
        : [
            validateTransaction({
              user_id: user_id,
              total: data.price * data.quantity,
              product: validateProductDTO(data),
              ...metaData,
            }),
          ];

      const transaction = await this.transactionService.create(products);

      if (!transaction) {
        res.status(502).send({ success: false, message: "No transaction created" });
        return;
      }
      res.status(201).send(transaction);
    } catch (error) {
      this.error(error, res);
    }
  }

  /**
   * for updating a transaction data (restricted to updating status only)
   * @param req request containing transaction id and data to update (check if the user is authorized to update the transaction)
   * @param res response containing success message
   */
  public async updateById(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res) || !this.checkReqParams) return;
    try {
      const id = new ObjectId(String(req.params.id));
      const data = validateTransactionDTO(req.body);
      const updatedTransaction = await this.transactionService.updateById(id, data);

      if (!updatedTransaction)
        res.status(502).send({ success: false, message: "No transaction updated" });
      else res.status(200).send(updatedTransaction);
    } catch (error) {
      this.error(error, res);
    }
  }

  public async getUserTransactions(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const user_id = validateObjectId(req.body.user_id);
      const query = validateFilter(req.query);
      const transaction = await this.transactionService.findManyByUserId(user_id, query);

      if (!transaction) res.status(404).send({ success: false, message: "Transaction not found" });
      else res.status(200).send(transaction);
    } catch (error) {
      this.error(error, res);
    }
  }
}
