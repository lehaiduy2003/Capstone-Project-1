import SessionService from "../../../Base/SessionService";

import generateTokens from "../../../libs/jwt/tokensGenerating";
import refreshAccessToken from "../../../libs/jwt/tokenRefreshing";

import { AuthDTO, validateAuthDTO } from "../../../libs/zod/dto/AuthDTO";
import { Account } from "../../../libs/zod/model/Account";

import UserProfileService from "../../UserProfile/Services/UserProfileService";

import AccountService from "../../Account/Services/AccountService";
import { validateUserProfile } from "../../../libs/zod/model/UserProfile";
import deleteCache from "../../../libs/redis/cacheDeleting";
import { validateSignUpDTO } from "../../../libs/zod/dto/SignUpDTO";
import { ObjectId } from "mongodb";
import decodeToken from "../../../libs/jwt/tokenDecoding";
import { Payload } from "../../../libs/zod/Payload";

/**
 * Responsible for handling the authentication process.
 * ``It supported by the AccountService and UserProfileService``.
 *  The main transaction is handled by the SessionService, which is extended by this class.
 *  The main transaction is handled by the SessionService, which is extended by this class.
 * @class AccountService
 * @class UserProfileService
 */
export default class AuthService extends SessionService {
  protected readonly accountService: AccountService;
  protected readonly userProfileService: UserProfileService;

  public constructor(accountService: AccountService, userProfileService: UserProfileService) {
    super();
    this.accountService = accountService;
    this.userProfileService = userProfileService;
  }

  async signUp(data: Partial<Account>): Promise<AuthDTO | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const accountData = validateSignUpDTO(data);

      if (await this.accountService.isEmailExist(accountData.email)) {
        await this.abortTransaction();
        return null;
      }
      if (accountData.phone) {
        if (await this.userProfileService.isPhoneExist(accountData.phone)) {
          await this.abortTransaction();
          return null;
        }
      }
      const newAccount = await this.accountService.create(accountData, this.getSession());

      const userData = validateUserProfile({
        account_id: String(newAccount._id),
        phone: accountData.phone,
        name: accountData.name,
        address: accountData.address ? [accountData.address] : [],
      });

      const newUser = await this.userProfileService.create(userData, this.getSession());
      const tokens = generateTokens(String(newAccount._id), newAccount.role);
      await this.commitTransaction();
      return validateAuthDTO({
        account_id: String(newAccount._id),
        user_id: String(newUser._id),
        role: newAccount.role,
        ...tokens,
      });
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  async getNewAccessToken(token: string) {
    try {
      const payloadDecoded = decodeToken(token) as Payload;
      if (!payloadDecoded) {
        throw new Error("Invalid token");
      }

      const account = await this.accountService.findById(new ObjectId(payloadDecoded.sub));
      if (!account) {
        throw new Error("Account not found");
      }

      return refreshAccessToken(String(account._id), account.role);
    } catch (error) {
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<AuthDTO | null> {
    const account = await this.accountService.findByEmail(email);
    if (!account) {
      throw new Error("Account not found");
    }
    //console.log("account", account);
    const isPasswordValid = this.accountService.verifyAccountPassword(account, password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    if (account.status === "inactive") {
      throw new Error("Account is inactive");
    }

    const userProfile = await this.userProfileService.findByAccountId(
      new ObjectId(String(account._id))
    );
    // console.log("userProfile", userProfile);
    if (!isPasswordValid || !userProfile) {
      return null;
    }

    const tokens = generateTokens(String(account._id), account.role);
    return validateAuthDTO({
      account_id: String(account._id),
      user_id: String(userProfile._id),
      role: account.role,
      ...tokens,
    });
  }

  async activateAccount(email: string): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      await this.accountService.activateAccount(email, this.getSession());

      await this.commitTransaction();
      return true;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await deleteCache(email); // delete the cache after activation
      await this.endSession();
    }
  }

  async deactivateAccount(email: string): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      await this.accountService.deactivateAccount(email, this.getSession());

      await this.commitTransaction();
      return true;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await deleteCache(email); // delete the cache after deactivation
      await this.endSession();
    }
  }

  async resetPassword(email: string, newPassword: string) {
    await this.startSession();
    this.startTransaction();
    try {
      const account = await this.accountService.findByEmail(email);
      if (!account) {
        await this.abortTransaction();
        return false;
      }
      await this.accountService.updatePassword(account, newPassword, this.getSession());

      await this.commitTransaction();
      return true;
    } catch (e) {
      await this.abortTransaction();
      throw e;
    } finally {
      await this.endSession();
    }
  }
}
