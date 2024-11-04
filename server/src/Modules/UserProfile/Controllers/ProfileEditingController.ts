import { Request, Response } from "express";
import BaseController from "../../../Base/BaseController";
import ProfileEditingService from "../Services/ProfileEditingService";

import { ObjectId } from "mongodb";

export default class ProfileEditingController extends BaseController {
  private readonly profileEditingService: ProfileEditingService;

  public constructor(profileEditingService: ProfileEditingService) {
    super();
    this.profileEditingService = profileEditingService;
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const { oldPassword, newPassword } = req.body;
      const id = new ObjectId(String(req.body.user.sub)); // user.sub is the account_id (from the token)
      const updatedStatus = await this.profileEditingService.changePassword(
        id,
        oldPassword,
        newPassword,
      );

      if (!updatedStatus) {
        res.status(502).send({ message: "Failed to change password" });
        return;
      }

      res.status(200).send({ message: "password updated successfully" });
    } catch (error) {
      this.error(error, res);
    }
  }
}
