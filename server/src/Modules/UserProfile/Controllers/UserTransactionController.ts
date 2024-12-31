import { Request, Response } from "express";
import BaseController from "../../../Base/BaseController";
import UserTransactionService from "../Services/UserTransactionService";

import { ObjectId } from "mongodb";

export default class UserTransactionController extends BaseController {
  private readonly userTransactionService: UserTransactionService;

  public constructor(userTransactionService: UserTransactionService) {
    super();
    this.userTransactionService = userTransactionService;
  }

  async getUserTransactions(req: Request, res: Response): Promise<void> {
    if (!this.checkReqQuery(req, res)) return;
    try {
      const id = new ObjectId(String(req.body.user_id));

      const transactions = await this.userTransactionService.getUserTransactions(id);

      if (!transactions || transactions.length === 0) {
        res.status(404).send({ success: false, message: "No transactions found" });
        return;
      }
      res.status(200).send({ success: true, data: transactions });
    } catch (error) {
      this.error(error, res);
    }
  }
}
