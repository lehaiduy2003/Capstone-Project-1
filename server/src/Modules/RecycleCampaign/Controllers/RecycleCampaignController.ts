import BaseController from "../../../Base/BaseController";
import RecycleCampaignService from "../Services/RecycleCampaignService";

import { Request, Response } from "express";
import { validateRecycleCampaign } from "../../../libs/zod/model/RecyclingCampaign";

export default class RecycleCampaignController extends BaseController {
  private recycleCampaignService: RecycleCampaignService;

  constructor(recycleCampaignService: RecycleCampaignService) {
    super();
    this.recycleCampaignService = recycleCampaignService;
  }

  public async createCampaign(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      const parsedCampaign = validateRecycleCampaign(req.body);
      const campaign = await this.recycleCampaignService.create(parsedCampaign);

      res.status(201).send({ campaign });
    } catch (e) {
      this.error(e, res);
    }
  }
}
