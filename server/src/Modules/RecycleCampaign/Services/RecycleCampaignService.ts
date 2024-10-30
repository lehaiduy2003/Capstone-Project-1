import SessionService from "../../../Base/SessionService";
import { RecycleCampaign } from "../../../libs/zod/model/RecyclingCampaign";
import recycleCampaignsModel from "../Models/recycleCampaignsModel";

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
      const createdStatus = await recycleCampaign.save({ session });

      if (!createdStatus) {
        await this.abortTransaction();
        return null;
      }

      await this.commitTransaction();
      return createdStatus;
    } catch (error) {
      await this.abortTransaction();
      throw error;
    } finally {
      await this.endSession();
    }
  }
}
