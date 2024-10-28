import SessionService from "./init/SessionService";

import { Transaction, validateTransaction } from "../libs/zod/model/Transaction";

import { Filter, validateFilter } from "../libs/zod/Filter";

import { ObjectId } from "mongodb";
import transactionsModel from "../models/transactionsModel";

export default class TransactionService extends SessionService {
  public constructor() {
    super();
  }

  async getTransactionHistory(
    user_id: string,
    filter: Partial<Filter>
  ): Promise<Partial<Transaction>[] | null> {
    const parsedFilter = validateFilter(filter);

    const transactions = await transactionsModel
      .find({ user_id: new ObjectId(user_id) })
      .sort({ [parsedFilter.sort]: parsedFilter.order })
      .skip(parsedFilter.skip)
      .limit(parsedFilter.limit);

    return transactions.map(validateTransaction);
  }

  /**
   * @param {Partial<Transaction>} data
   * @returns {Promise<Transaction | null>}
   */
  async create(data: Partial<Transaction>): Promise<Transaction | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const parsedData = validateTransaction(data);
      const transaction: Transaction | null = new transactionsModel(parsedData);
      await transaction.save({ session: this.getSession() });

      if (!transaction) {
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
      const updateStatus = await transactionsModel.findOneAndUpdate(
        { _id: new ObjectId(id) },
        data,
        this.getSession()
      );
      if (!updateStatus?.isModified) {
        await this.abortTransaction();
        return false;
      }
      await this.commitTransaction();
      return true;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }
}
