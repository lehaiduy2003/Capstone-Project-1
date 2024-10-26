import SessionService from "./init/BaseService";

import TransactionsModel from "../models/TransactionsModel";
import { Transaction } from "../libs/zod/model/Transaction";

import { validateFilter } from "../libs/zod/Filter";

import { ObjectId } from "mongodb";
import { validateTransactionDTO } from "../libs/zod/dto/TransactionDTO";

export default class TransactionService extends SessionService {
  private readonly transactionModel: TransactionsModel;
  public constructor(transactionModel: TransactionsModel) {
    super();
    this.transactionModel = transactionModel;
  }

  async getTransactionHistory(user_id: string): Promise<Partial<Transaction>[] | null> {
    return await this.transactionModel.findTransactions(
      validateFilter({ sort: "updatedAt", order: "desc" }),
      "user_id",
      new ObjectId(user_id)
    );
  }

  /**
   * @param {[products:{id: ObjectId, img: string, name: string, price: number, quantity: number}]} products
   * @param {id: ObjectId, address: string, phone: string, name: string} buyer
   * @param {id: ObjectId, address: string, phone: string, name: string} seller
   * @returns {Promise<Document<TransactionsModel> | null>}
   */
  async create(data: Partial<Transaction>): Promise<Transaction | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const parsedData = validateTransactionDTO(data);
      const transaction: Transaction | null = await this.transactionModel.insert(parsedData, this.getSession());
      if (!transaction || transaction === null) {
        await this.abortTransaction();
        return null;
      }
      await this.commitTransaction();
      return transaction;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }
  async updateTransactionById(id: string, data: Partial<Transaction>): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      const isUpdatedTransaction = await this.transactionModel.updateTransactionByUnique(
        "_id",
        new ObjectId(id),
        data,
        this.getSession()
      );
      if (isUpdatedTransaction === false) {
        await this.abortTransaction();
        return false;
      }
      await this.commitTransaction();
      return isUpdatedTransaction;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }
}
