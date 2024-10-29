import SessionService from "./init/SessionService";

import generateTokens from "../libs/jwt/tokensGenerating";
import refreshAccessToken from "../libs/jwt/tokenRefreshing";

import { AuthDTO, validateAuthDTO } from "../libs/zod/dto/AuthDTO";
import { Account } from "../libs/zod/model/Account";

import UserProfileService from "./UserProfileService";

import AccountService from "./AccountService";
import { validateUserProfile } from "../libs/zod/model/UserProfile";
import deleteCache from "../libs/redis/cacheDeleting";
import { validateSignUpDTO } from "../libs/zod/dto/SignUpDTO";

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

  async signUp(data: Partial<Account>): Promise<Account | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const accountData = validateSignUpDTO(data);

      if (await this.accountService.isAccountExist(accountData.email)) {
        await this.abortTransaction();
        return null;
      }
      const newAccount = await this.accountService.create(accountData, this.getSession());
      if (!newAccount) {
        await this.abortTransaction();
        return null;
      }

      const userData = validateUserProfile({
        account_id: String(newAccount._id),
      });

      const newUser = await this.userProfileService.create(userData, this.getSession());
      if (!newUser) {
        await this.abortTransaction();
        return null;
      }

      await this.commitTransaction();
      return newAccount;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  getNewAccessToken(token: string) {
    return refreshAccessToken(token);
  }

  async signIn(email: string, password: string): Promise<AuthDTO | null> {
    const account = await this.accountService.getAccountByEmail(email);

    if (!account || account.status === "inactive") {
      throw new Error("Account not found or inactive");
    }
    //console.log("account", account);
    const isPasswordValid = this.accountService.verifyAccountPassword(account, password);

    const userProfile = await this.userProfileService.findUserProfileByAccountId(
      String(account._id)
    );
    // console.log("userProfile", userProfile);
    if (!isPasswordValid || !userProfile) {
      return null;
    }

    const tokens = generateTokens(String(account._id), account.role);
    return validateAuthDTO({
      account_id: String(account._id),
      user_id: String(userProfile._id),
      ...tokens,
    });
  }

  async activateAccount(email: string): Promise<boolean> {
    await this.startSession();
    this.startTransaction();
    try {
      const updatedStatus = await this.accountService.activateAccount(email, this.getSession());
      if (!updatedStatus) {
        await this.abortTransaction();
        return false;
      }

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
}
