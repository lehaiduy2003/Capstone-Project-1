import { Model, Schema } from "mongoose";
import { ObjectId } from "mongodb";

import BaseModel from "./init/BaseModel";
import AccountsModel from "./AccountsModel";
import UserProfilesModel from "./UserProfilesModel";

import { UserProfile } from "../libs/zod/model/UserProfile";
import { Account } from "../libs/zod/model/Account";

// For
export default class AuthModel extends BaseModel<
  AuthModel & Model<Account, UserProfile>,
  any
> {
  private readonly accountModel = new AccountsModel();
  private readonly userProfileModel = new UserProfilesModel();
  private static instance: AuthModel;
  private constructor() {
    super("auth", new Schema());
  }

  public static getInstance(): AuthModel {
    if (!this.instance) {
      this.instance = new AuthModel();
    }
    return this.instance;
  }

  public getAccountModel(): AccountsModel {
    return this.accountModel;
  }

  public getUserProfileModel(): UserProfilesModel {
    return this.userProfileModel;
  }

  /**
   * Check the _id field of the accounts collection
   * @param account_id
   * @returns
   */
  public async findUserProfileByAccountId(
    account_id: ObjectId,
  ): Promise<UserProfile | null> {
    try {
      return this.accountModel.getModel().findOne({ _id: account_id });
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
  public async findUserProfileByEmail(
    email: string,
  ): Promise<UserProfile | null> {
    try {
      const account: Account | null =
        await this.accountModel.findAccountByEmail(email);
      if (account) {
        return this.findUserProfileByAccountId(
          new ObjectId(String(account._id)),
        );
      }
      return null;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
}
