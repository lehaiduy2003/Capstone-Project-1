import { ClientSession } from "mongoose";

import { UserProfile, validateUserProfile } from "../../../libs/zod/model/UserProfile";

import { ObjectId } from "mongodb";
import userProfilesModel from "../Models/userProfilesModel";
import { UserProfileDTO, validateUserProfileDTO } from "../../../libs/zod/dto/UserProfileDTO";
import { ProfileUpdatingDTO } from "../../../libs/zod/dto/ProfileUpdatingDTO";
import { Filter } from "../../../libs/zod/Filter";
import accountsModel from "../../Account/Models/accountsModel";
import SessionService from "../../../Base/SessionService";
import { AdminCreateUserDTO } from "../../../libs/zod/dto/AdminCreateUserDTO";
import AccountService from "../../Account/Services/AccountService";

export default class UserProfileService extends SessionService {
  async deleteById(id: ObjectId) {
    const user = await userProfilesModel.findOne({ _id: id }).lean();
    if (!user) return null;

    await this.startSession();
    this.startTransaction();
    try {
      await userProfilesModel.deleteOne({ _id: id }, { session: this.getSession() });
      await accountsModel.deleteOne({ _id: user.account_id }, { session: this.getSession() });
      await this.commitTransaction();
      return true;
    } catch (error) {
      await this.abortTransaction();
      return false;
    }
  }
  async isPhoneExist(phone: string | undefined) {
    return await userProfilesModel.findOne({ phone: phone }).lean();
  }
  async updateById(id: ObjectId, data: ProfileUpdatingDTO) {
    return await userProfilesModel.findOneAndUpdate({ _id: id }, data, { new: true }).lean();
  }
  public constructor() {
    super();
  }

  async create(data: Partial<UserProfile>, session: ClientSession): Promise<UserProfile> {
    const userProfile = new userProfilesModel(validateUserProfile(data));

    const createStatus = await userProfile.save({ session });

    if (!createStatus) {
      await session.abortTransaction();
      throw new Error("Failed to save user profile");
    }

    return createStatus;
  }

  async createByAdmin(data: AdminCreateUserDTO): Promise<UserProfile> {
    const accountService = new AccountService();

    if (await accountService.isEmailExist(data.email)) {
      throw new Error("Email already exists");
    }

    if (await this.isPhoneExist(data.phone)) {
      throw new Error("Phone already exists");
    }

    await this.startSession();
    this.startTransaction();
    try {
      const newAccount = await accountService.create(
        {
          email: data.email,
          password: data.password,
          role: data.role,
          status: data.status,
        },
        this.getSession()
      );

      const userData = validateUserProfile({
        account_id: String(newAccount._id),
        phone: data.phone,
        name: data.name,
        address: data.address,
      });

      const newUser = await this.create(userData, this.getSession());
      await this.commitTransaction();
      return newUser;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  /**
   * find user profile by account_id
   * @param account_id account_id
   * @returns user profile
   */
  async findByAccountId(account_id: ObjectId): Promise<UserProfile | null> {
    //console.log("account_id", account_id);
    return await userProfilesModel.findOne({ account_id: account_id }).lean();
  }

  async findById(id: ObjectId): Promise<UserProfileDTO | null> {
    const userProfile = await userProfilesModel.findOne({ _id: id }).lean();
    // console.log("userProfile", userProfile);
    if (!userProfile) return null;
    return validateUserProfileDTO(userProfile);
  }

  async findMany(filter: Filter) {
    const accounts = await accountsModel
      .find(filter.type ? { role: filter.type } : {})
      .sort({ [filter.sort]: filter.order })
      .skip(filter.skip)
      .limit(filter.limit)
      .select("_id")
      .lean();
    const profilePromises = accounts.map((account) =>
      userProfilesModel.findOne({ account_id: account._id }).lean()
    );
    const userProfiles = await Promise.all(profilePromises);
    // console.log("userProfiles", userProfiles);
    return userProfiles.map(validateUserProfileDTO);
  }

  async increaseScore(id: ObjectId, score: number) {
    return await userProfilesModel
      .findOneAndUpdate({ _id: id }, { $inc: { score: score } }, { new: true })
      .lean();
  }
}
