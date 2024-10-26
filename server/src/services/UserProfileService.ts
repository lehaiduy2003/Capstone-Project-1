import { ClientSession } from "mongoose";
import UserProfilesModel from "../models/UserProfilesModel";

import { UserProfile } from "../libs/zod/model/UserProfile";

import { ObjectId } from "mongodb";
export default class UserProfileService {
  private readonly userProfilesModel: UserProfilesModel;
  public constructor(userProfilesModel: UserProfilesModel) {
    this.userProfilesModel = userProfilesModel;
  }

  async create(data: Partial<UserProfile>, session: ClientSession): Promise<UserProfile | null> {
    return await this.userProfilesModel.insert(data, session);
  }

  /**
   * find user profile by account_id
   * @param account_id account_id
   * @returns user profile
   */
  async findUserProfileByAccountId(account_id: string): Promise<UserProfile | null> {
    //console.log("account_id", account_id);

    return await this.userProfilesModel.findUserProfileByUnique("account_id", new ObjectId(account_id));
  }

  async findUserProfileById(id: string): Promise<UserProfile | null> {
    return await this.userProfilesModel.findUserProfileByUnique("_id", new ObjectId(id));
  }
}
