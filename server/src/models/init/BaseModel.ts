import mongoose, { ClientSession, FilterQuery, Model, Schema } from "mongoose";
import IModel from "./IModel";

import { Filter } from "../../libs/zod/Filter";
import { keyValue } from "../../libs/zod/keyValue";
import { ServiceModelTypeSchema } from "../../libs/zod/ServiceModelType";

import { Account } from "../../libs/zod/model/Account";
import { UserProfile } from "../../libs/zod/model/UserProfile";
import { Product } from "../../libs/zod/model/Product";
import { Transaction } from "../../libs/zod/model/Transaction";
import { Payment } from "../../libs/zod/model/Payment";
import { RecycleCampaign } from "../../libs/zod/model/RecyclingCampaign";
import { Activity } from "../../libs/zod/model/Activity";

/**
 * @param T: Model
 * @param K: document
 * @description: BaseModel class provides common CRUD operations for various Mongoose models.
 */
export default abstract class BaseModel<T, K> implements IModel<K> {
  private readonly model: typeof Model<K>;
  protected constructor(name: string, schema: Schema) {
    switch (name) {
      case ServiceModelTypeSchema.Enum.account:
        this.model = mongoose.model<Account>(name, schema) as Model<Account>;
        break;
      case ServiceModelTypeSchema.Enum.user:
        this.model = mongoose.model<UserProfile>(
          name,
          schema,
        ) as Model<UserProfile>;
        break;
      case ServiceModelTypeSchema.Enum.product:
        this.model = mongoose.model<Product>(name, schema) as Model<Product>;
        break;
      case ServiceModelTypeSchema.Enum.transaction:
        this.model = mongoose.model<Transaction>(
          name,
          schema,
        ) as Model<Transaction>;
        break;
      case ServiceModelTypeSchema.Enum.payment:
        this.model = mongoose.model<Payment>(name, schema) as Model<Payment>;
        break;
      case ServiceModelTypeSchema.Enum.recycle:
        this.model = mongoose.model<RecycleCampaign>(
          name,
          schema,
        ) as Model<RecycleCampaign>;
        break;
      case ServiceModelTypeSchema.Enum.activities:
        this.model = mongoose.model<Activity>(name, schema) as Model<Activity>;
        break;
      case ServiceModelTypeSchema.Enum.auth:
        this.model = mongoose.model<Account>(name, schema) as Model<Account>;
        break;
      default:
        throw new Error("invalid model type when instance model");
    }
  }
  public getModel(): typeof Model<K> {
    return this.model;
  }
  /**
   * Updates a document by a unique field.
   * @param field - The unique field to match.
   * @param keyValue - The value of the unique field.
   * @param data - The data to update.
   * @param session - The Mongoose client session.
   * @returns A promise that resolves to true if the update was successful, otherwise false.
   */
  async updateByUnique(
    field: keyof K,
    keyValue: keyValue,
    data: Partial<K>,
    session: ClientSession,
  ): Promise<boolean> {
    try {
      const result = await this.model.updateOne(
        { [field]: keyValue } as FilterQuery<K>,
        data,
        {
          session,
        },
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error(`Error while updating ${keyValue} of ${field.toString()}`);
      return false;
    }
  }

  /**
   * Deletes a document by a unique field.
   * @param field - The unique field to match.
   * @param keyValue - The value of the unique field.
   * @param session - The Mongoose client session.
   * @returns A promise that resolves to true if the deletion was successful, otherwise false.
   */
  async deleteByUnique(
    field: keyof K,
    keyValue: keyValue,
    session: ClientSession,
  ): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(
        { [field]: keyValue } as FilterQuery<K>,
        {
          session,
        },
      );

      console.log("result", result);

      return result !== null && result.deletedCount > 0;
    } catch (error) {
      console.error(
        `Error while deleting ${keyValue} of ${field.toString()}`,
        error,
      );
      return false;
    }
  }
  /**
   * Inserts a new document.
   * @param data - The data to insert.
   * @param session - The Mongoose client session.
   * @returns A promise that resolves to the inserted document, or null if the insertion failed.
   */
  async insert(data: Partial<K>, session: ClientSession): Promise<K | null> {
    try {
      const result = await this.model.create([data], { session });
      return result[0];
    } catch (error) {
      console.error(`Error while inserting ${data}`);
      throw error;
    }
  }
  /**
   * Finds all documents.
   * @returns A promise that resolves to an array of documents, or null if the operation failed.
   */
  async findAll(): Promise<K[] | null> {
    throw new Error("Method not implemented.");
  }
  /**
   * Finds a document by a unique field.
   * @param field - The unique field to match.
   * @param keyValue - The value of the unique field.
   * @returns A promise that resolves to the found document, or null if no document was found.
   */
  async findByUnique(field: keyof K, keyValue: keyValue): Promise<K | null> {
    try {
      const result = await this.model.findOne({
        [field]: keyValue,
      } as FilterQuery<T>);
      return result;
    } catch (error) {
      console.error(
        `Error while finding ${keyValue} of ${field.toString()}`,
        error,
      );
      return null;
    }
  }
  /**
   * Finds documents with a filter.
   * @param filter - The filter to apply.
   * @param field - An optional unique field to match.
   * @param keyValue - An optional value of the unique field.
   * @returns A promise that resolves to an array of documents, or null if the operation failed.
   */
  async findWithFilter(
    filter: Filter,
    field?: keyof K,
    keyValue?: keyValue,
  ): Promise<K[] | null> {
    const filterQuery: FilterQuery<K> =
      field && keyValue ? ({ [field]: keyValue } as FilterQuery<K>) : {};
    try {
      const results = await this.model
        .find(filterQuery)
        .sort({ [filter.sort]: filter.orderBy } as FilterQuery<K>)
        .limit(filter.limit)
        .skip(filter.skip);

      return results;
    } catch (error) {
      console.error(`Error while finding with filter ${filterQuery}`, error);
      return null;
    }
  }
}
