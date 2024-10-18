import { ObjectId } from "mongodb";

import BaseService from "./init/BaseService";

import generateTokens from "../libs/jwt/tokensGenerating";
import refreshAccessToken from "../libs/jwt/tokenRefreshing";

import { AuthDTO, validateAuthDTO } from "../libs/zod/dto/AuthDTO";
import { Account } from "../libs/zod/model/Account";

import UserProfileService from "./UserProfileService";

import AuthModel from "../models/AuthModel";
import AccountService from "./AccountService";
import { Filter } from "../libs/zod/Filter";
import { keyValue } from "../libs/zod/keyValue";
import { validateUserProfile } from "../libs/zod/model/UserProfile";
/**
 * Responsible for handling the authentication process.
 * ``It supported by the AccountService and UserProfileService``.
 * ``The main transaction is handled by the BaseService, which is extended by this class``.
 * @class AccountService
 * @class UserProfileService
 */
export default class AuthService extends BaseService<AuthModel, unknown> {
  read(
    field: keyof never,
    keyValue: keyValue,
    filter: Filter,
  ): Promise<unknown[] | null> {
    throw new Error("Method not implemented.");
  }

  override async create(data: Partial<Account>): Promise<unknown> {
    await this.startSession();
    this.startTransaction();
    try {
      if (await this.accountService.isAccountExist(String(data.email))) {
        await this.abortTransaction();
        return null;
      }

      const newAccount = await this.accountService.create(
        data,
        this.getSession(),
      );
      if (!newAccount) {
        await this.abortTransaction();
        return null;
      }

      const newUser = await this.userProfileService.create(
        validateUserProfile({ account_id: String(newAccount._id) }),
        this.getSession(),
      );
      if (!newUser) {
        await this.abortTransaction();
        return null;
      }

      const tokens = generateTokens(String(newAccount._id), newAccount.role);

      await this.commitTransaction();
      return validateAuthDTO({
        account_id: String(newAccount._id),
        user_id: String(newUser._id),
        ...tokens,
      });
    } catch (error) {
      await this.abortTransaction();
      console.error("Error during sign up:");
      throw error;
    } finally {
      await this.endSession();
    }
  }
  update(
    field: keyof never,
    keyValue: keyValue,
    data: Partial<unknown>,
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  // FIXME: This method is deleting the user profile and account,
  // but it should delete all the user data (transactions, products, etc) also
  override async delete(
    field: keyof Account,
    keyValue: string,
  ): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      // using user_id as the key to delete the account
      if (
        !(await this.accountService.delete("_id", keyValue, this.getSession()))
      ) {
        await this.abortTransaction();
        return false;
      }

      // using user_id as the key to delete the user profile
      if (
        !(await this.userProfileService.delete(
          "account_id",
          keyValue,
          this.getSession(),
        ))
      ) {
        await this.abortTransaction();
        return false;
      }

      await this.commitTransaction();
      return true;
    } catch (error) {
      await this.abortTransaction();
      console.error("error while deleting account: ", error);
      return false;
    } finally {
      await this.endSession();
    }
  }
  private readonly accountService = new AccountService();
  private readonly userProfileService = new UserProfileService();
  private static instance: AuthService;

  private constructor() {
    super("auth");
  }

  public static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService();
    }
    return this.instance;
  }

  getNewAccessToken(token: string) {
    return refreshAccessToken(token);
  }

  async signIn(email: string, password: string): Promise<AuthDTO | null> {
    try {
      const account = await this.accountService.getAccountByEmail(email);

      if (account === null || account.status === "inactive") {
        console.log("User not found or account is inactive");
        return null;
      }

      const isPasswordValid = this.accountService.verifyAccountPassword(
        account,
        password,
      );

      if (
        !isPasswordValid ||
        !(await this.userProfileService.isUserProfileExist(
          new ObjectId(String(account._id)),
        ))
      ) {
        console.log("User not found or password is invalid");
        return null;
      }

      const tokens = generateTokens(String(account._id), account.role);
      return validateAuthDTO({ account_id: String(account._id), ...tokens });
    } catch (error) {
      console.error("Error during sign in:", error);
      throw error;
    }
  }
}
