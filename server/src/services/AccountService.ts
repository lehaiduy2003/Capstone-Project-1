import AccountsModel from "../models/AccountsModel";
import BaseService from "./init/BaseService";
import { Account, validateAccount } from "../libs/zod/model/Account";
import verifyPassword from "../libs/crypto/passwordVerifying";
import hashPassword from "../libs/crypto/passwordHashing";
import { ClientSession } from "mongoose";
import { Filter } from "../libs/zod/Filter";
import { keyValue } from "../libs/zod/keyValue";

export default class AccountService extends BaseService<
  AccountsModel,
  Account
> {
  public constructor() {
    super("account");
  }

  read(
    field: keyof Account,
    keyValue: keyValue,
    filter: Filter,
  ): Promise<Account[]> {
    throw new Error("Method not implemented.");
  }

  /**
   * for creating a new account
   * @param data
   * @param session
   * @returns
   */
  override async create(
    data: Partial<Account>,
    session: ClientSession,
  ): Promise<Account | null> {
    const hashedPassword = hashPassword(String(data.password));
    const accountData = validateAccount({
      email: String(data.email),
      password: hashedPassword,
      role: data.role,
    });
    return await this.getModel().insert(accountData, session);
  }

  update(
    field: keyof Account,
    keyValue: keyValue,
    data: Partial<Account>,
    session: ClientSession,
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  override async delete(
    field: keyof Account,
    keyValue: keyValue,
    session: ClientSession,
  ): Promise<boolean> {
    return this.getModel().deleteByUnique(field, keyValue, session);
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
    return await this.getModel().findAccountByEmail(email);
  }

  // async createAccount(data: Partial<Account>, session: ClientSession): Promise<Account | null> {
  //   const hashedPassword = hashPassword(String(data.password));
  //   const accountData = validateAccount({
  //     email: String(data.email),
  //     password: hashedPassword,
  //     role: data.role,
  //   });
  //   return await this.getModel().insert(accountData, session);
  // }

  /**
   * Check if user profile exist, return true if exist, false otherwise
   * @param accountId
   * @returns
   */
  async isAccountExist(email: string): Promise<boolean> {
    const account = await this.getModel().findAccountByEmail(email);
    return account !== null;
  }

  static isAccountActive(account: Account | null): boolean {
    return account !== null && account.status !== "inactive";
  }

  verifyAccountPassword(account: Account, password: string): boolean {
    const [passwordSalt, passwordHash] = account.password.split(":");
    return verifyPassword(password, passwordSalt, passwordHash);
  }
}
