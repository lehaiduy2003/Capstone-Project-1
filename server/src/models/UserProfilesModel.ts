import { KeyValue } from "../libs/zod/KeyValue";
import { UserProfile } from "../libs/zod/model/UserProfile";
import { ClientSession, FilterQuery, model, Model } from "mongoose";
import userProfilesSchema from "./schemas/UserProfilesSchema";

export default class UserProfilesModel {
  private readonly model: Model<UserProfile>;
  public constructor() {
    this.model = model<UserProfile>("userprofiles", userProfilesSchema);
  }

  /**
   * Inserts a new document.
   * @param data - The data to insert.
   * @param session - The Mongoose client session.
   * @returns A promise that resolves to the inserted document, or null if the insertion failed.
   */
  async insert(data: Partial<UserProfile>, session: ClientSession): Promise<UserProfile | null> {
    const modelInstance = new this.model(data);
    return await modelInstance.save({ session });
  }

  /**
   * Finds a document by a unique field.
   * @param field - The unique field to match.
   * @param keyValue - The value of the unique field.
   * @returns A promise that resolves to the found document, or null if no document was found.
   */
  async findUserProfileByUnique(field: keyof UserProfile, keyValue: KeyValue): Promise<UserProfile | null> {
    // console.log("field", field);
    // console.log("keyValue", keyValue);

    return await this.model.findOne({ [field]: keyValue } as FilterQuery<UserProfile>);
  }
}
