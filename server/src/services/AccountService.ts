import AccountsModel from "../models/AccountsModel";

import { ClientSession } from "mongoose";

import { Account, validateAccount } from "../libs/zod/model/Account";
import verifyPassword from "../libs/crypto/passwordVerifying";
import hashPassword from "../libs/crypto/passwordHashing";
import { KeyValue } from "../libs/zod/KeyValue";

export default class AccountService {
  private readonly accountsModel: AccountsModel;
  public constructor(accountsModel: AccountsModel) {
    this.accountsModel = accountsModel;
  }
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
    return await this.accountsModel.insert(accountData, session);
  }

  async delete(field: keyof Account, keyValue: KeyValue, session: ClientSession): Promise<boolean> {
    return this.accountsModel.deleteAccountByUnique(field, keyValue, session);
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
    return await this.accountsModel.findAccountByUnique("email", email);
  }

  /**
   * Check if user profile exist, return true if exist, false otherwise
   * @param accountId
   * @returns
   */
  async isAccountExist(email: string): Promise<boolean> {
    const account = await this.getAccountByEmail(email);
    return account !== null;
  }

  isAccountActive(account: Account | null): boolean {
    return account !== null && account.status !== "inactive";
  }

  public verifyAccountPassword(account: Account, password: string): boolean {
    const [passwordSalt, passwordHash] = account.password.split(":");
    return verifyPassword(password, passwordSalt, passwordHash);
  }
}
