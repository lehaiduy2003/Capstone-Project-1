import { Account } from "../libs/zod/model/Account";
import { KeyValue } from "../libs/zod/KeyValue";
import { ClientSession, FilterQuery, Model, model } from "mongoose";
import { RecyclerField } from "../libs/zod/model/RecyclerField";
import accountsSchema from "./schemas/AccountsSchema";

export default class AccountsModel {
  private readonly recyclerField?: RecyclerField;
  private readonly model: Model<Account>;
  public constructor() {
    this.recyclerField = this.recyclerField || {
      recyclingLicenseNumber: "",
      recyclingCapacity: 0,
    };
    this.model = model<Account>("account", accountsSchema);
  }

  /**
   * Updates a document by a unique field.
   * @param field - The unique field to match.
   * @param keyValue - The value of the unique field.
   * @param data - The data to update.
   * @param session - The Mongoose client session.
   * @returns A promise that resolves to true if the update was successful, otherwise false.
   */
  async UpdateAccountByUnique(
    field: keyof Account,
    keyValue: KeyValue,
    data: Partial<Account>,
    session: ClientSession
  ): Promise<boolean> {
    const result = await this.model.updateOne({ [field]: keyValue } as FilterQuery<Account>, data, {
      session,
    });
    return result.modifiedCount > 0;
  }
  /**
   * Inserts a new document.
   * @param data - The data to insert.
   * @param session - The Mongoose client session.
   * @returns A promise that resolves to the inserted document, or null if the insertion failed.
   */
  async insert(data: Partial<Account>, session: ClientSession): Promise<Account | null> {
    const modelInstance = new this.model(data);
    return await modelInstance.save({ session });
  }
  /**
   * Finds a document by a unique field.
   * @param field - The unique field to match.
   * @param keyValue - The value of the unique field.
   * @returns A promise that resolves to the found document, or null if no document was found.
   */
  async findAccountByUnique(field: keyof Account, keyValue: KeyValue): Promise<Account | null> {
    return await this.model.findOne({ [field]: keyValue } as FilterQuery<Account>);
  }
  /**
   * Deletes a document by a unique field.
   * @param field - The unique field to match.
   * @param keyValue - The value of the unique field.
   * @param session - The Mongoose client session.
   * @returns A promise that resolves to true if the deletion was successful, otherwise false.
   */
  async deleteAccountByUnique(field: keyof Account, keyValue: KeyValue, session: ClientSession): Promise<boolean> {
    const result = await this.model.findByIdAndDelete({ [field]: keyValue } as FilterQuery<Account>, {
      session,
    });
    return result !== null;
  }
}
