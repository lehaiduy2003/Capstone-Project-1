import { Request, Response } from "express";
import BaseController from "../../../Base/BaseController";
import DonationService from "../Services/DonationService";

export default class DonationController extends BaseController {
  private readonly donationService: DonationService;
  constructor(donationService: DonationService) {
    super();
    this.donationService = donationService;
  }

  async create(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      const donation = await this.donationService.create(req.body);
      res.status(201).send({ success: true, data: donation });
    } catch (error) {
      this.error(error, res);
    }
  }

  async generateQRCode(req: Request, res: Response) {
    if (!this.checkReqParams(req, res)) return;
    try {
      const { userId, campaignId, content, quantity, weight } = req.body;
      const qrCode = await this.donationService.generateQRCode(
        userId,
        campaignId,
        content,
        quantity,
        weight
      );
      res.status(200).send({ success: true, qrCode });
    } catch (error) {
      this.error(error, res);
    }
  }
}
