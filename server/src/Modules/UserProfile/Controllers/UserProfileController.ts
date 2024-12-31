import { Request, Response } from "express";
import UserProfileService from "../Services/UserProfileService";
import BaseController from "../../../Base/BaseController";

import { ObjectId } from "mongodb";
import { validateProfileUpdatingDTO } from "../../../libs/zod/dto/ProfileUpdatingDTO";
import { validateFilter } from "../../../libs/zod/Filter";
import { validateAdminCreateUserDTO } from "../../../libs/zod/dto/AdminCreateUserDTO";

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
      res.status(200).send(userProfile);
    } catch (error) {
      this.error(error, res);
    }
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    if (!this.checkReqParams) return;
    try {
      const id = new ObjectId(String(req.params.id));
      const userProfile = await this.userProfileService.deleteById(id);
      if (!userProfile) {
        res.status(404).send({ success: false, message: "No user found" });
        return;
      }
      res.status(200).send({ success: true, message: "User profile account deleted" });
    } catch (error) {
      this.error(error, res);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const data = validateAdminCreateUserDTO(req.body);
      const userProfile = await this.userProfileService.createByAdmin(data);
      res.status(201).send({ success: true, data: userProfile });
    } catch (error) {
      this.error(error, res);
    }
  }

  async updateById(req: Request, res: Response): Promise<void> {
    if (!this.checkReqParams) return;
    try {
      const id = new ObjectId(String(req.params.id));
      const data = validateProfileUpdatingDTO(req.body);
      const userProfile = await this.userProfileService.updateById(id, data);
      res.status(200).send({ success: true, userProfile });
    } catch (error) {
      this.error(error, res);
    }
  }

  async findMany(req: Request, res: Response): Promise<void> {
    if (!this.checkReqQuery) return;
    const query = req.query;
    try {
      const parsedQuery = validateFilter(query);
      const userProfile = await this.userProfileService.findMany(parsedQuery);
      res.status(200).send({ success: true, data: userProfile });
    } catch (error) {
      this.error(error, res);
    }
  }
}
