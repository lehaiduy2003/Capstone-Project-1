import { Request, Response } from "express";
import errorHandler from "../../../middlewares/errorMiddleware";
import { ObjectId } from "mongodb";
import UserCampaignService from "../Services/UserCampaignService";
import deleteCache from "../../../libs/redis/cacheDeleting";
export default class UserCampaignController {
  private readonly userCampaignService: UserCampaignService;

  public constructor(userCampaignService: UserCampaignService) {
    this.userCampaignService = userCampaignService;
  }

  async getUserCampaignByUserId(req: Request, res: Response): Promise<void> {
    try {
      const id = new ObjectId(String(req.body.user_id));
      const userCampaign = await this.userCampaignService.findById(id);
      res.status(200).send(userCampaign);
    } catch (error) {
      errorHandler(error, res);
    }
  }

  async joinCampaign(req: Request, res: Response): Promise<void> {
    try {
      const id = new ObjectId(String(req.params.id));
      const userId = new ObjectId(String(req.body.user_id));
      const userCampaign = await this.userCampaignService.joinCampaign(userId, id);
      res.status(200).send(userCampaign);
    } catch (error) {
      if (error instanceof Error && error.message === "User already joined this campaign") {
        res.status(400).send({ success: false, message: error.message });
        return;
      }
      errorHandler(error, res);
    }
  }

  async leaveCampaign(req: Request, res: Response): Promise<void> {
    try {
      const id = new ObjectId(String(req.params.id));
      const userId = new ObjectId(String(req.body.user_id));
      const userCampaign = await this.userCampaignService.leaveCampaign(userId, id);
      res.status(200).send(userCampaign);
    } catch (error) {
      if (error instanceof Error && error.message === "User did not join this campaign before") {
        res.status(400).send({ success: false, message: error.message });
        return;
      }
      errorHandler(error, res);
    }
  }
}
