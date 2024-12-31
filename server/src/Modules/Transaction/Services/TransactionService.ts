import SessionService from "../../../Base/SessionService";

import { Transaction } from "../../../libs/zod/model/Transaction";

import { ObjectId } from "mongodb";
import transactionsModel from "../Models/transactionsModel";
import { TransactionDTO, validateTransactionDTO } from "../../../libs/zod/dto/TransactionDTO";
import { Filter } from "../../../libs/zod/Filter";
import UserProfileService from "../../UserProfile/Services/UserProfileService";

export default class TransactionService extends SessionService {
  async getPendingTransactions(ownerId: ObjectId, filter: Filter) {
    const transactions = await transactionsModel
      .find({ "product.owner": ownerId, transaction_status: "pending" })
      .sort({ [filter.sort]: filter.order })
      .skip(filter.skip)
      .limit(filter.limit)
      .lean();

    // console.log(transactions);

    return transactions;
  }
  async findById(id: ObjectId) {
    const transaction = await transactionsModel.findById(id).lean();
    return validateTransactionDTO(transaction);
  }
  public constructor() {
    super();
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
      if (data.transaction_status === "completed") {
        const user = new UserProfileService();
        await user.increaseScore(updateStatus!.user_id, 10);
        await user.increaseScore(updateStatus!.product.owner, 10);
      }
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
