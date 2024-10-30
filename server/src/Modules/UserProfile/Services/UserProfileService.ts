import { ClientSession } from "mongoose";

import {
  UserProfile,
  validateUserProfile,
} from "../../../libs/zod/model/UserProfile";

import { ObjectId } from "mongodb";
import userProfilesModel from "../Models/userProfilesModel";
import {
  UserProfileDTO,
  validateUserProfileDTO,
} from "../../../libs/zod/dto/UserProfileDTO";

export default class UserProfileService {
  public constructor() {}

  async create(
    data: Partial<UserProfile>,
    session: ClientSession,
  ): Promise<UserProfile> {
    const userProfile = new userProfilesModel(validateUserProfile(data));

    const createStatus = await userProfile.save({ session });

    if (!createStatus) {
      await session.abortTransaction();
      throw new Error("Failed to save user profile");
    }

    return createStatus;
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
    const userProfile = await userProfilesModel.findOne({ _id: id });
    // console.log("userProfile", userProfile);
    if (!userProfile) return null;
    return validateUserProfileDTO(userProfile);
  }
}
