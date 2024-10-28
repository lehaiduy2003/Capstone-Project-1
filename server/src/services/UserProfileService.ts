import {ClientSession} from "mongoose";

import {UserProfile, validateUserProfile} from "../libs/zod/model/UserProfile";

import {ObjectId} from "mongodb";
import userProfilesModel from "../models/userProfilesModel";
import {UserProfileDTO, validateUserProfileDTO} from "../libs/zod/dto/UserProfileDTO";

export default class UserProfileService {
    public constructor() {
    }

    async create(data: Partial<UserProfile>, session: ClientSession): Promise<UserProfile | null> {
        const userProfile = new userProfilesModel(validateUserProfile(data));

        const createStatus = await userProfile.save({session});

        if (!createStatus) return null;

        return createStatus;
    }

    /**
     * find user profile by account_id
     * @param account_id account_id
     * @returns user profile
     */
    async findUserProfileByAccountId(account_id: string): Promise<UserProfile | null> {
        //console.log("account_id", account_id);
        return await userProfilesModel.findOne({account_id: new ObjectId(account_id)});
    }

    async findUserProfileById(id: string): Promise<UserProfileDTO | null> {
        const userProfile = await userProfilesModel.findOne({_id: new ObjectId(id)});
        // console.log("userProfile", userProfile);
        return validateUserProfileDTO(userProfile);
    }
}
