import { ClientSession } from "mongoose";
import { DeleteResult, ObjectId } from "mongodb";
import { Account, validateAccount } from "../../../libs/zod/model/Account";
import verifyPassword from "../../../libs/crypto/passwordVerifying";
import hashPassword from "../../../libs/crypto/passwordHashing";
import { KeyValue } from "../../../libs/zod/KeyValue";
import accountsModel from "../Models/accountsModel";

export default class AccountService {
  async updatePassword(
    account: Account,
    password: string,
    session: ClientSession
  ): Promise<Account> {
    const hashedPassword = hashPassword(password);

    const updatedStatus = await accountsModel.findOneAndUpdate(
      { email: account.email },
      { password: hashedPassword },
      { session }
    );

    if (!updatedStatus) {
      throw new Error("Failed to update password");
    }

    return updatedStatus;
  }

  public constructor() {}

  /**
   * for creating a new account
   * @param data
   * @param session
   * @returns
   */
  async create(data: Partial<Account>, session: ClientSession): Promise<Account> {
    const hashedPassword = hashPassword(String(data.password));
    const accountData = validateAccount({
      email: String(data.email),
      password: hashedPassword,
      role: data.role,
    });

    const account = new accountsModel(accountData);
    const createStatus = await account.save({ session });

    if (!createStatus) {
      throw new Error("Failed to save account");
    }

    return createStatus;
  }

  async delete(
    field: keyof Account,
    keyValue: KeyValue,
    session: ClientSession
  ): Promise<DeleteResult> {
    // return this.accountsModel.deleteAccountByUnique(field, keyValue, session);
    const deleteResult = await accountsModel.deleteOne({ [field]: keyValue }, { session });

    if (deleteResult.deletedCount === 0) {
      throw new Error("Failed to delete account");
    }

    return deleteResult;
  }

  // async deleteAccountById(account_id: string): Promise<boolean> {
  //   return this.getModel().deleteByUnique("_id", new ObjectId(account_id), this.getSession());
  // }

  /**
   * Get account by email
   * @param email
   * @returns
   */
  async findByEmail(email: string): Promise<Account | null> {
    return await accountsModel.findOne({ email: email }).lean();
  }

  async findById(id: ObjectId): Promise<Account | null> {
    return await accountsModel.findOne({ _id: id }).lean();
  }

  /**
   * Check if user profile exist, return true if existed, false otherwise
   * @param email
   * @returns
   */
  async isEmailExist(email: string): Promise<boolean> {
    return (await this.findByEmail(email)) != null;
  }

  public verifyAccountPassword(account: Account, password: string): boolean {
    const [passwordSalt, passwordHash] = account.password.split(":");
    return verifyPassword(password, passwordSalt, passwordHash);
  }

  async activateAccount(email: string, session: ClientSession): Promise<Account> {
    const account = await accountsModel.findOne({ email: email });
    // console.log("account", account);
    if (!account || account.status === "active") {
      throw new Error("Account not found or already activated");
    }

    const updatedStatus = await account.updateOne({ status: "active" }, { new: true, session });
    // console.log("updatedStatus", updatedStatus);

    if (updatedStatus.modifiedCount < 1) {
      throw new Error("Failed to activate account");
    }
    return updatedStatus;
  }

  async deactivateAccount(email: string, session: ClientSession): Promise<Account> {
    const account = await accountsModel.findOne({ email: email });
    if (!account || account.status === "inactive") {
      throw new Error("Account not found or already deactivated");
    }

    const updatedStatus = await account.updateOne({ status: "inactive" }, { session });

    if (!updatedStatus?.isModified) {
      throw new Error("Failed to deactivate account");
    }

    return updatedStatus;
  }
}
