import recycleCampaignsModel from "../../RecycleCampaign/Models/recycleCampaignsModel";
import userProfilesModel from "../Models/userProfilesModel";

import { ObjectId } from "mongodb";

export default class UserCampaignService {
  public constructor() {}

  // Get detail information of all campaigns that user joined
  // Not await each findOneAndUpdate because we don't need to wait for each findOneAndUpdate to finish
  // We can wait for all findOneAndUpdate to finish by using Promise.all
  private async getDetailCampaigns(joined_campaigns: ObjectId[]) {
    const campaignsPromises = joined_campaigns.map((campaignId: ObjectId) => {
      return recycleCampaignsModel.findOne({ _id: campaignId }).lean();
    });

    return await Promise.all(campaignsPromises);
  }

  private async getUser(id: ObjectId) {
    const user = await userProfilesModel.findOne({ _id: id }).lean();
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  // Modify the number of participants in a campaign after user join (increase) or leave (decrease)
  private async modifyCampaignParticipants(id: ObjectId, participants: number) {
    await recycleCampaignsModel.findOneAndUpdate(
      { _id: id },
      { $inc: { participants: participants } }
    );
  }

  // Check if user already joined a campaign
  private checkJoinedCampaigns(joined_campaigns: ObjectId[], id: ObjectId) {
    return joined_campaigns.some((campaignId: ObjectId) => campaignId.equals(id));
  }

  async findById(id: ObjectId) {
    const user = await this.getUser(id);
    const campaigns = await this.getDetailCampaigns(user.joined_campaigns);

    return campaigns.filter((campaign) => campaign !== null);
  }

  async joinCampaign(userId: ObjectId, id: ObjectId) {
    const user = await this.getUser(userId);
    if (!user.joined_campaigns) {
      user.joined_campaigns = [];
    }

    if (this.checkJoinedCampaigns(user.joined_campaigns, id)) {
      throw new Error("User already joined this campaign");
    }

    const updatedUserCampaign = await userProfilesModel
      .findOneAndUpdate({ _id: userId }, { $addToSet: { joined_campaigns: id } }, { new: true })
      .lean();

    await this.modifyCampaignParticipants(id, 1);

    return this.getDetailCampaigns(updatedUserCampaign!.joined_campaigns);
  }

  async leaveCampaign(userId: ObjectId, id: ObjectId) {
    const user = await this.getUser(userId);

    // If user did not join this campaign before, throw an error
    if (!this.checkJoinedCampaigns(user.joined_campaigns, id)) {
      throw new Error("User did not join this campaign before");
    }

    const updatedUserCampaign = await userProfilesModel
      .findOneAndUpdate({ _id: userId }, { $pull: { joined_campaigns: id } }, { new: true })
      .lean();

    await this.modifyCampaignParticipants(id, -1);

    return this.getDetailCampaigns(updatedUserCampaign!.joined_campaigns);
  }
}
