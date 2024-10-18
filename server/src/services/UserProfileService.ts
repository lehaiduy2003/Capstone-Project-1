import { ObjectId } from "mongodb";
import { ClientSession, Document } from "mongoose";
import UserProfilesModel from "../models/UserProfilesModel";

import BaseService from "./init/BaseService";

import { UserProfile } from "../libs/zod/model/UserProfile";
import { keyValue } from "../libs/zod/keyValue";
import { Filter } from "../libs/zod/Filter";

export default class UserProfileService extends BaseService<
  UserProfilesModel,
  UserProfile
> {
  read(
    field: keyof UserProfile,
    keyValue: keyValue,
    filter: Filter,
  ): Promise<UserProfile[] | null> {
    throw new Error("Method not implemented.");
  }
  override async create(
    data: Partial<UserProfile>,
    session: ClientSession,
  ): Promise<UserProfile | null> {
    return await this.getModel().insert(data, session);
  }
  update(
    field: keyof UserProfile,
    keyValue: keyValue,
    data: Partial<UserProfile>,
    session: ClientSession,
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(
    field: keyof UserProfile,
    keyValue: keyValue,
    session: ClientSession,
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public constructor() {
    super("user");
  }

  /**
   * Check if user profile exist, return true if exist, false otherwise
   * @param accountId
   * @returns
   */
  async isUserProfileExist(accountId: ObjectId): Promise<boolean> {
    const userProfile =
      await this.getModel().findUserProfileByAccountId(accountId);
    return userProfile !== null;
  }
}
