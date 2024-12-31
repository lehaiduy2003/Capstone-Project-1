import BaseController from "../../../Base/BaseController";
import RecycleCampaignService from "../Services/RecycleCampaignService";
import QRCode from "qrcode";
import { Request, Response } from "express";
import { validateRecycleCampaign } from "../../../libs/zod/model/RecyclingCampaign";
import { validateFilter } from "../../../libs/zod/Filter";
import saveToCache from "../../../libs/redis/cacheSaving";
import { ObjectId } from "mongodb";
import { Donate, validateDonate } from "../../../libs/zod/Donate";
export default class RecycleCampaignController extends BaseController {
  private recycleCampaignService: RecycleCampaignService;

  constructor(recycleCampaignService: RecycleCampaignService) {
    super();
    this.recycleCampaignService = recycleCampaignService;
  }

  public async create(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      const parsedCampaign = validateRecycleCampaign(req.body);
      const campaign = await this.recycleCampaignService.create(parsedCampaign);

      res.status(201).send({ campaign });
    } catch (e) {
      this.error(e, res);
    }
  }

  public async closeCampaign(req: Request, res: Response) {
    if (!this.checkReqParams(req, res)) return;
    try {
      const id = new ObjectId(req.params.id);
      const campaign = await this.recycleCampaignService.closeCampaign(id);

      res.status(200).send({ campaign });
    } catch (e) {
      this.error(e, res);
    }
  }

  public async openCampaign(req: Request, res: Response) {
    if (!this.checkReqParams(req, res)) return;
    try {
      const id = new ObjectId(req.params.id);
      const campaign = await this.recycleCampaignService.openCampaign(id);

      res.status(200).send({ campaign });
    } catch (e) {
      this.error(e, res);
    }
  }

  public async findByUserId(req: Request, res: Response) {
    if (!this.checkReqParams(req, res)) return;
    try {
      const userId = new ObjectId(req.params.id);
      const campaigns = await this.recycleCampaignService.findByUserId(userId);
      if (!campaigns || campaigns.length === 0) {
        res.status(404).send({ success: false, message: "No campaigns found" });
      } else {
        // await saveToCache(req.body.cacheKey, 30, campaigns); // save to cache for 30 seconds
        res.status(200).send(campaigns);
      }
    } catch (error) {
      this.error(error, res);
    }
  }

  public async donateCampaign(req: Request, res: Response) {
    if (!this.checkReqBody(req, res)) return;
    try {
      // console.log("QR code scanned");

      const query = req.query;
      const data = validateDonate(query);
      const qrCode = await this.recycleCampaignService.donateCampaign(data);
      res.status(200).send({ success: true, qrCode });
    } catch (error) {
      this.error(error, res);
    }
  }

  public async findMany(req: Request, res: Response): Promise<void> {
    if (!this.checkReqQuery(req, res)) return;
    const query = req.query;
    try {
      const parsedFilter = validateFilter(query);
      const products = await this.recycleCampaignService.findMany(parsedFilter);

      if (!products || products.length === 0) {
        res.status(404).send({ success: false, message: "No products found" });
      } else {
        await saveToCache(req.body.cacheKey, 30, products); // save to cache for 30 seconds
        res.status(200).send(products);
      }
    } catch (error) {
      this.error(error, res);
    }
  }
  async search(req: Request, res: Response): Promise<void> {
    if (!this.checkReqQuery(req, res)) return;
    try {
      const parsedFilter = validateFilter(req.query);

      const products = await this.recycleCampaignService.search(parsedFilter);

      if (!products || products.length === 0) {
        res.status(200).send({ message: "No products found" });
        return;
      }

      await saveToCache(req.body.cacheKey, 30, products); // save to cache for 30 seconds

      res.status(200).send(products);
    } catch (error) {
      this.error(error, res);
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    if (!this.checkReqParams) return;
    try {
      const id = new ObjectId(req.params.id);

      const product = await this.recycleCampaignService.findById(id);

      if (!product) {
        res.status(404).send({ message: "Product not found" });
        return;
      }
      // await saveToCache(req.body.cacheKey, 10, product); // save to cache for 10 seconds
      res.status(200).send(product);
    } catch (error) {
      this.error(error, res);
    }
  }
}
