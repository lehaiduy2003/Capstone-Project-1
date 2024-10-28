import {Request, Response} from "express";

import BaseController from "./init/BaseController";

import TransactionService from "../services/TransactionService";

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
    public async createTransaction(req: Request, res: Response): Promise<void> {
        if (!this.checkReqBody(req, res)) return;
        try {
            const transaction = await this.transactionService.create(req.body);

            if (!transaction) res.status(502).send({message: "No transaction created"});
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
    public async updateTransaction(req: Request, res: Response): Promise<void> {
        if (!this.checkReqBody(req, res) || !this.checkReqParams) return;
        try {
            const {id} = req.params;

            const updatedTransaction: boolean = await this.transactionService.updateTransactionById(id, req.body);

            if (!updatedTransaction) res.status(502).send({message: "No transaction updated"});
            else res.status(200).send({message: "Transaction updated successfully"});
        } catch (error) {
            this.error(error, res);
        }
    }

    public async getUserTransactions(req: Request, res: Response): Promise<void> {
        if (!this.checkReqBody(req, res)) return;
        try {
            const {user_id} = req.body.user;

            const transaction = await this.transactionService.getTransactionHistory(user_id, req.query);

            if (!transaction) res.status(404).send({message: "Transaction not found"});
            else res.status(200).send(transaction);
        } catch (error) {
            this.error(error, res);
        }
    }
}
