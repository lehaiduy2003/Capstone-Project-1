import deleteCache from "../libs/redis/cacheDeleting";
import AccountService from "./AccountService";
import AuthService from "./AuthService";
import UserProfileService from "./UserProfileService";

import { ObjectId } from "mongodb";

export default class ProfileEditingService extends AuthService {
  public constructor() {
    super(new AccountService(), new UserProfileService());
  }

  async getAccountByUserId(user_id: ObjectId) {
    const user = await this.userProfileService.findUserProfileById(user_id);
    if (!user) return null;

    const account = this.accountService.findAccountById(user.account_id);
    return account;
  }

  async changePassword(account_id: ObjectId, oldPassword: string, newPassword: string) {
    await this.startSession();
    this.startTransaction();
    try {
      // console.log("account_id", account_id);

      const account = await this.accountService.findAccountById(account_id);
      // console.log("account", account);

      if (!account) {
        await this.abortTransaction();
        return null;
      }

      const isPasswordValid = this.accountService.verifyAccountPassword(account, oldPassword);
      if (!isPasswordValid) {
        await this.abortTransaction();
        return null;
      }

      const updatedStatus = await this.accountService.updatePassword(
        account,
        newPassword,
        this.getSession()
      );
      if (!updatedStatus) {
        await this.abortTransaction();
        return null;
      }
      await this.commitTransaction();
      return true;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  async updateNewPassword(email: string, password: string) {
    await this.startSession();
    this.startTransaction();
    try {
      const account = await this.accountService.getAccountByEmail(email);
      if (!account) {
        await this.abortTransaction();
        return null;
      }

      const isPasswordValid = this.accountService.verifyAccountPassword(account, password);
      if (!isPasswordValid) {
        await this.abortTransaction();
        return null;
      }

      const updatedStatus = await this.accountService.updatePassword(
        account,
        password,
        this.getSession()
      );
      if (!updatedStatus) {
        await this.abortTransaction();
        return null;
      }
      await this.commitTransaction();
      return true;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await deleteCache(email); // delete the cache after password update
      await this.endSession();
    }
  }
}
