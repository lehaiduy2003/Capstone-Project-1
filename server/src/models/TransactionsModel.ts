import { Filter } from "../libs/zod/Filter";
import { KeyValue } from "../libs/zod/KeyValue";
import { Transaction } from "../libs/zod/model/Transaction";
import { ClientSession, FilterQuery, model, Model } from "mongoose";
import transactionsSchema from "./schemas/TransactionsSchema";

export default class TransactionsModel {
  private readonly model: Model<Transaction>;
  public constructor() {
    this.model = model<Transaction>("transactions", transactionsSchema);
  }

  /**
   * Inserts a new document.
   * @param data - The data to insert.
   * @param session - The Mongoose client session.
   * @returns A promise that resolves to the inserted document, or null if the insertion failed.
   */
  async insert(data: Partial<Transaction>, session: ClientSession): Promise<Transaction | null> {
<<<<<<< HEAD
    const modelInstance = new this.model(data);
=======
    const modelInstance = new (this.getModel())(data);
>>>>>>> 103e756 (get transaction history api)
    return await modelInstance.save({ session });
  }

  /**
   * Updates a document by a unique field.
   * @param field - The unique field to match.
   * @param keyValue - The value of the unique field.
   * @param data - The data to update.
   * @param session - The Mongoose client session.
   * @returns A promise that resolves to true if the update was successful, otherwise false.
   */
  async updateTransactionByUnique(
    field: keyof Transaction,
    keyValue: KeyValue,
    data: Partial<Transaction>,
    session: ClientSession
  ): Promise<boolean> {
    const result = await this.model.updateOne({ [field]: keyValue } as FilterQuery<Transaction>, data, {
      session,
    });
    return result.modifiedCount > 0;
  }

  /**
   * Finds documents with a filter.
   * @param filter - The filter to apply.
   * @param field - An optional unique field to match.
   * @param keyValue - An optional value of the unique field.
   * @returns A promise that resolves to an array of documents, or null if the operation failed.
   */
  async findTransactions(
    filter: Filter,
    field?: keyof Transaction,
    keyValue?: KeyValue
  ): Promise<Transaction[] | null> {
    const filterQuery: FilterQuery<Transaction> =
      field && keyValue ? ({ [field]: keyValue } as FilterQuery<Transaction>) : {};
    return await this.model
      .find(filterQuery)
      .sort({ [filter.sort]: filter.order } as FilterQuery<Transaction>)
      .limit(filter.limit)
      .skip(filter.skip);
  }
}
