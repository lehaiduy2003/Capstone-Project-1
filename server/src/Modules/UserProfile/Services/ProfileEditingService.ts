import deleteCache from "../../../libs/redis/cacheDeleting";
import AccountService from "../../Account/Services/AccountService";
import AuthService from "../../Auth/Services/AuthService";
import userProfilesModel from "../Models/userProfilesModel";
import UserProfileService from "./UserProfileService";

import { ObjectId } from "mongodb";

export default class ProfileEditingService extends AuthService {
  public constructor() {
    super(new AccountService(), new UserProfileService());
  }

  /**
   * update the address of the user
   * @param id ObjectId - id of the user
   * @param data string[] - array of address
   */
  async updateAddress(id: ObjectId, data: string[]) {
    await this.startSession();
    this.startTransaction();
    try {
      const updatedStatus = await userProfilesModel.findOneAndUpdate(
        { account_id: id },
        { $addToSet: { address: { $each: data } } },
        { session: this.getSession(), new: true }
      );
      if (!updatedStatus) {
        throw new Error("Failed to update address");
      }
      await this.commitTransaction();
      return updatedStatus;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  async changePassword(account_id: ObjectId, oldPassword: string, newPassword: string) {
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

      const isPasswordValid = this.accountService.verifyAccountPassword(account, oldPassword);
      if (!isPasswordValid) {
        await this.abortTransaction();
        return false;
      }

      await this.accountService.updatePassword(account, newPassword, this.getSession());

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
