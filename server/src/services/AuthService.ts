import SessionService from "./init/SessionService";

import generateTokens from "../libs/jwt/tokensGenerating";
import refreshAccessToken from "../libs/jwt/tokenRefreshing";

import {AuthDTO, validateAuthDTO} from "../libs/zod/dto/AuthDTO";
import {Account, validateAccount} from "../libs/zod/model/Account";

import UserProfileService from "./UserProfileService";

import AccountService from "./AccountService";
import {validateUserProfile} from "../libs/zod/model/UserProfile";

/**
 * Responsible for handling the authentication process.
 * ``It supported by the AccountService and UserProfileService``.
 *  The main transaction is handled by the SessionService, which is extended by this class.
 * @class AccountService
 * @class UserProfileService
 */
export default class AuthService extends SessionService {
    private readonly accountService: AccountService;
    private readonly userProfileService: UserProfileService;

    public constructor(accountService: AccountService, userProfileService: UserProfileService) {
        super();
        this.accountService = accountService;
        this.userProfileService = userProfileService;
    }

    async signUp(data: Partial<Account>): Promise<AuthDTO | null> {
        await this.startSession();
        this.startTransaction();
        try {
            const accountData = validateAccount(data);

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

            const tokens = generateTokens(String(newAccount._id), newAccount.role);

            await this.commitTransaction();
            return validateAuthDTO({
                account_id: String(newAccount._id),
                user_id: String(newUser._id),
                ...tokens,
            });
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
            return null;
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
}
