import { Request, Response } from "express";
import UserProfileService from "../Services/UserProfileService";
import BaseController from "../../../Base/BaseController";

import { ObjectId } from "mongodb";
import saveToCache from "../../../libs/redis/cacheSaving";

export default class UserProfileController extends BaseController {
  private readonly userProfileService: UserProfileService;

  public constructor(userProfileService: UserProfileService) {
    super();
    this.userProfileService = userProfileService;
  }

  async getUserProfileById(req: Request, res: Response): Promise<void> {
    if (!this.checkReqParams) return;
    try {
      const id = new ObjectId(String(req.params.id));
      const userProfile = await this.userProfileService.findById(id);

      if (!userProfile) {
        res.status(502).send({ message: "No user profile found" });
        return;
      }
      // console.log(req.body.cacheKey);
      await saveToCache(req.body.cacheKey, 3600, userProfile);
      res.status(200).send(userProfile);
    } catch (error) {
      this.error(error, res);
    }
  }
}
