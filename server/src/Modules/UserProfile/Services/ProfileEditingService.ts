import deleteCache from "../../../libs/redis/cacheDeleting";
import AccountService from "../../Account/Services/AccountService";
import AuthService from "../../Auth/Services/AuthService";
import UserProfileService from "./UserProfileService";

import { ObjectId } from "mongodb";

export default class ProfileEditingService extends AuthService {
  public constructor() {
    super(new AccountService(), new UserProfileService());
  }

  async changePassword(
    account_id: ObjectId,
    oldPassword: string,
    newPassword: string,
  ) {
    await this.startSession();
    this.startTransaction();
    try {
      // console.log("account_id", account_id);

      const account = await this.accountService.findById(account_id);
      // console.log("account", account);
      if (!account) {
        await this.abortTransaction();
        return false;
      }

      const isPasswordValid = this.accountService.verifyAccountPassword(
        account,
        oldPassword,
      );
      if (!isPasswordValid) {
        await this.abortTransaction();
        return false;
      }

      await this.accountService.updatePassword(
        account,
        newPassword,
        this.getSession(),
      );

      await deleteCache(account.email); // delete the cache before password update
      await this.commitTransaction();
      return true;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }
}
