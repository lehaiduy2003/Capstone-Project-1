import { Request, Response } from "express";
import UserProfileService from "../services/UserProfileService";
import BaseController from "./init/BaseController";

import { ObjectId } from "mongodb";
export default class UserController extends BaseController {
  private readonly userProfileService: UserProfileService;
  public constructor(userProfileService: UserProfileService) {
    super();
    this.userProfileService = userProfileService;
  }

  async getUserProfileById(req: Request, res: Response): Promise<void> {
    if (!this.checkReqParams) return;
    try {
      const id = new ObjectId(String(req.params.id));
      const userProfile = await this.userProfileService.findUserProfileById(id);

      if (!userProfile) {
        res.status(404).send({ message: "No user profile found" });
        return;
      }

      res.status(200).send(userProfile);
    } catch (error) {
      this.error(error, res);
    }
  }
}
