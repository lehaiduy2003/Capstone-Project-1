import { PipelineStage } from "mongoose";
import SessionService from "../../../Base/SessionService";
import { Filter } from "../../../libs/zod/Filter";
import { RecycleCampaign } from "../../../libs/zod/model/RecyclingCampaign";
import recycleCampaignsModel from "../Models/recycleCampaignsModel";
import { ObjectId } from "mongodb";
import QRCode from "qrcode";
import { validateCampaignDTO } from "../../../libs/zod/dto/CampaignDTO";
import userProfilesModel from "../../UserProfile/Models/userProfilesModel";
import { Donate } from "../../../libs/zod/Donate";
export default class RecycleCampaignService extends SessionService {
  public constructor() {
    super();
  }

  public async create(data: Partial<RecycleCampaign>) {
    await this.startSession();
    this.startTransaction();
    const session = this.getSession();
    try {
      const recycleCampaign = new recycleCampaignsModel(data);
      const createdStatus = await recycleCampaign.save({ session: session });

      if (!createdStatus) {
        await this.abortTransaction();
        return null;
      }

      await this.commitTransaction();
      return validateCampaignDTO(createdStatus);
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }

  async closeCampaign(id: ObjectId) {
    return await recycleCampaignsModel.findOneAndUpdate(
      { _id: id },
      { status: false },
      { new: true }
    );
  }

  async openCampaign(id: ObjectId) {
    return await recycleCampaignsModel.findOneAndUpdate(
      { _id: id },
      { status: true },
      { new: true }
    );
  }

  async donateCampaign(data: Donate) {
    try {
      const user = await userProfilesModel.findOne({ _id: data.userId });
      if (!user) {
        throw new Error("User not found");
      }

      const joinedCampaign = user.joined_campaigns.find((campaign) =>
        campaign.equals(data.campaignId)
      );

      if (!joinedCampaign) {
        throw new Error("User has not joined this campaign");
      }

      await recycleCampaignsModel.findOneAndUpdate(
        { _id: data.campaignId },
        { $inc: { recycled_weight: Number(data.weight), recycled_amount: Number(data.quantity) } },
        { new: true }
      );

      await userProfilesModel.findOneAndUpdate(
        { _id: data.userId },
        {
          $inc: { reputation_score: 10 },
        },
        { new: true }
      );

      console.log("QR code confirmed, successfully donated to campaign");

      return true;
    } catch (error) {
      throw error;
    }
  }

  async findByUserId(userId: ObjectId) {
    return await recycleCampaignsModel.find({ creator_id: userId }).lean();
  }

  async findMany(filter: Filter) {
    const campaigns = await recycleCampaignsModel
      .find({
        status: true,
      })
      .sort({ [filter.sort]: filter.order })
      .skip(filter.skip)
      .limit(filter.limit)
      .lean();

    // console.log(campaigns);

    return campaigns.map(validateCampaignDTO);
  }

  public async search(filter: Filter) {
    const order = filter.order === "asc" || filter.order === "ascending" ? 1 : -1;

    const aggregationPipeline: PipelineStage[] = [];

    // Add a $search stage if query name is provided
    if (filter.query) {
      aggregationPipeline.push({
        $search: {
          index: "campaign_name",
          text: {
            query: filter.query,
            path: "name",
            fuzzy: { maxEdits: 2 },
          },
        },
      });
    }

    // Add a $match stage to filter by status and quantity
    aggregationPipeline.push({
      $match: {
        status: true,
      },
    });

    aggregationPipeline.push(
      { $sort: { [filter.sort]: order } },
      { $limit: filter.limit },
      { $skip: filter.skip }
    );

    const products: RecycleCampaign[] = await recycleCampaignsModel.aggregate(aggregationPipeline);

    return products.map(validateCampaignDTO);
  }

  public async findById(id: ObjectId) {
    return await recycleCampaignsModel.findOne({ _id: id }).lean();
  }
}
