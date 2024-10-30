import SessionService from "../../../Base/SessionService";

import {
  Transaction,
  validateTransaction,
} from "../../../libs/zod/model/Transaction";

import { Filter, validateFilter } from "../../../libs/zod/Filter";

import { ObjectId } from "mongodb";
import transactionsModel from "../Models/transactionsModel";

export default class TransactionService extends SessionService {
  public constructor() {
    super();
  }

  async findManyByUserId(
    user_id: ObjectId,
    filter: Partial<Filter>,
  ): Promise<Partial<Transaction>[] | null> {
    const parsedFilter = validateFilter(filter);

    const transactions = await transactionsModel
      .find({ user_id: user_id })
      .sort({ [parsedFilter.sort]: parsedFilter.order })
      .skip(parsedFilter.skip)
      .limit(parsedFilter.limit)
      .lean();

    return transactions.map(validateTransaction);
  }

  /**
   * @param {Partial<Transaction>} data
   * @returns {Promise<Transaction | null>}
   */
  async create(data: Partial<Transaction>): Promise<Transaction> {
    await this.startSession();
    this.startTransaction();
    try {
      const parsedData = validateTransaction(data);
      const transaction: Transaction | null = new transactionsModel(parsedData);
      await transaction.save({ session: this.getSession() });

      await this.commitTransaction();
      return transaction;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  async updateById(
    id: ObjectId,
    data: Partial<Transaction>,
  ): Promise<Transaction | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const updateStatus = await transactionsModel.findOneAndUpdate(
        { _id: id },
        data,
        this.getSession(),
      );
      if (!updateStatus?.isModified) {
        await this.abortTransaction();
        return null;
      }
      await this.commitTransaction();
      return updateStatus;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }
}
