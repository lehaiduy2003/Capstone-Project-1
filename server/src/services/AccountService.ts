import { ClientSession } from "mongoose";

import { Account, validateAccount } from "../libs/zod/model/Account";
import verifyPassword from "../libs/crypto/passwordVerifying";
import hashPassword from "../libs/crypto/passwordHashing";
import { KeyValue } from "../libs/zod/KeyValue";
import accountsModel from "../models/accountsModel";

export default class AccountService {
  public constructor() {}

  /**
   * for creating a new account
   * @param data
   * @param session
   * @returns
   */
  async create(data: Partial<Account>, session: ClientSession): Promise<Account | null> {
    const hashedPassword = hashPassword(String(data.password));
    const accountData = validateAccount({
      email: String(data.email),
      password: hashedPassword,
      role: data.role,
    });

    const account = new accountsModel(accountData);
    const createStatus = await account.save({ session });

    if (!createStatus) return null;

    return createStatus;
  }

  async delete(field: keyof Account, keyValue: KeyValue, session: ClientSession): Promise<boolean> {
    // return this.accountsModel.deleteAccountByUnique(field, keyValue, session);
    const isSuccess = await accountsModel.deleteOne({ [field]: keyValue }, { session });
    return isSuccess.deletedCount > 0;
  }

  // async deleteAccountById(account_id: string): Promise<boolean> {
  //   return this.getModel().deleteByUnique("_id", new ObjectId(account_id), this.getSession());
  // }

  /**
   * Get account by email
   * @param email
   * @returns
   */
  async getAccountByEmail(email: string): Promise<Account | null> {
    return await accountsModel.findOne({ email: email });
  }

  /**
   * Check if user profile exist, return true if existed, false otherwise
   * @param email
   * @returns
   */
  async isAccountExist(email: string): Promise<boolean> {
    return (await this.getAccountByEmail(email)) != null;
  }

  isAccountActive(account: Account | null): boolean {
    return account !== null && account.status !== "inactive";
  }

  public verifyAccountPassword(account: Account, password: string): boolean {
    const [passwordSalt, passwordHash] = account.password.split(":");
    return verifyPassword(password, passwordSalt, passwordHash);
  }
}
