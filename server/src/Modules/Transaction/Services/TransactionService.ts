import SessionService from "../../../Base/SessionService";

import { Transaction } from "../../../libs/zod/model/Transaction";

import { Filter } from "../../../libs/zod/Filter";

import { ObjectId } from "mongodb";
import transactionsModel from "../Models/transactionsModel";
import { TransactionDTO, validateTransactionDTO } from "../../../libs/zod/dto/TransactionDTO";

export default class TransactionService extends SessionService {
  public constructor() {
    super();
  }

  async findManyByUserId(
    user_id: ObjectId,
    filter: Filter
  ): Promise<Partial<Transaction>[] | null> {
    const transactions = await transactionsModel
      .find({ user_id: user_id })
      .sort({ [filter.sort]: filter.order })
      .skip(filter.skip)
      .limit(filter.limit)
      .lean();

    // delete shipper_id for prevent leaking sensitive information of shipper
    return transactions.map((transaction) => {
      const dto = validateTransactionDTO(transaction);
      delete dto.shipper_id;
      return dto;
    });
  }

  async create(data: Partial<Transaction>[]) {
    await this.startSession();
    this.startTransaction();
    const session = this.getSession();
    try {
      const transactionPromises = data.map((data) => {
        const transaction: Transaction | null = new transactionsModel(data);
        return transaction.save({ session: session });
      });
      const transactions = await Promise.all(transactionPromises);
      const dto = transactions.map(validateTransactionDTO);
      await this.commitTransaction();
      return dto;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  async updateById(id: ObjectId, data: Partial<TransactionDTO>): Promise<Transaction | null> {
    await this.startSession();
    this.startTransaction();
    const session = this.getSession();
    try {
      if (data.payment_method) {
        await this.abortTransaction();
        throw new Error("Not allowed to update payment_method");
      }
      data.updated_at = new Date();
      const updateStatus = await transactionsModel.findOneAndUpdate({ _id: id }, data, {
        session,
        new: true,
      });
      if (!updateStatus?.isModified) {
        await this.abortTransaction();
        return null;
      }
      await this.commitTransaction();
      delete updateStatus.shipper_id;
      return updateStatus;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }
}
