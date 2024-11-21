import { PipelineStage } from "mongoose";
import SessionService from "../../../Base/SessionService";
import { Filter } from "../../../libs/zod/Filter";
import {
  RecycleCampaign,
  validateRecycleCampaign,
} from "../../../libs/zod/model/RecyclingCampaign";
import recycleCampaignsModel from "../Models/recycleCampaignsModel";
import { ObjectId } from "mongodb";
import { validateCampaignDTO } from "../../../libs/zod/dto/CampaignDTO";
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

    return campaigns.map(validateRecycleCampaign);
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
        quantity: { $gte: 1 },
      },
    });

    aggregationPipeline.push(
      { $sort: { [filter.sort]: order } },
      { $limit: filter.limit },
      { $skip: filter.skip }
    );

    const products: RecycleCampaign[] = await recycleCampaignsModel.aggregate(aggregationPipeline);

    return products.map(validateRecycleCampaign);
  }

  public async findById(id: ObjectId) {
    return await recycleCampaignsModel.findOne({ _id: id }).lean();
  }
}
