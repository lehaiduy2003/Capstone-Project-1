import BaseService from "./init/BaseService";

import TransactionsModel from "../models/TransactionsModel";
import { Transaction } from "../libs/zod/model/Transaction";

import { Filter } from "../libs/zod/Filter";
import { keyValue } from "../libs/zod/keyValue";

export default class TransactionService extends BaseService<
  TransactionsModel,
  Transaction
> {
  public constructor() {
    super("transaction");
  }

  read(
    field: keyof Transaction,
    keyValue: keyValue,
    filter: Filter,
  ): Promise<Transaction[] | null> {
    throw new Error("Method not implemented.");
  }
  /**
   * @param {[products:{id: ObjectId, img: string, name: string, price: number, quantity: number}]} products
   * @param {id: ObjectId, address: string, phone: string, name: string} buyer
   * @param {id: ObjectId, address: string, phone: string, name: string} seller
   * @returns {Promise<Document<TransactionsModel> | null>}
   */
  override async create(
    data: Partial<Transaction>,
  ): Promise<Transaction | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const transaction: Transaction | null = await this.getModel().insert(
        data,
        this.getSession(),
      );
      if (!transaction || transaction === null) {
        await this.abortTransaction();
        return null;
      }
      await this.commitTransaction();
      return transaction;
    } catch (error) {
      await this.abortTransaction();
      console.error("error while create transaction: ", error);
      return null;
    } finally {
      await this.endSession();
    }
  }
  override async update(
    field: keyof Transaction,
    keyValue: keyValue,
    data: Partial<Transaction>,
  ): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      const isUpdatedTransaction = await this.getModel().updateByUnique(
        field,
        keyValue,
        data,
        this.getSession(),
      );
      if (isUpdatedTransaction === false) {
        await this.abortTransaction();
        return false;
      }
      await this.commitTransaction();
      return isUpdatedTransaction;
    } catch (error) {
      await this.abortTransaction();
      console.error("error while updating transaction: ", error);
      return false;
    } finally {
      await this.endSession();
    }
  }
  delete(field: keyof Transaction, keyValue: keyValue): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
