import { Request, Response } from "express";
import BaseController from "./init/BaseController";
import ProfileEditingService from "../services/ProfileEditingService";

import { ObjectId } from "mongodb";

export default class ProfileEditingController extends BaseController {
  private readonly profileEditingService: ProfileEditingService;
  public constructor(profileEditingService: ProfileEditingService) {
    super();
    this.profileEditingService = profileEditingService;
  }
  async forgotPassword(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const { email, password, type } = req.body;
      if (type !== "forgot") {
        res.status(400).send({ message: "Invalid forgot password request" });
        return;
      }
      const updatedStatus = await this.profileEditingService.updateNewPassword(email, password);
      if (!updatedStatus) {
        res.status(400).send({ message: "Failed to update profile" });
        return;
      }

      res.status(200).send({ message: "Profile updated successfully" });
    } catch (error) {
      this.error(error, res);
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const { oldPassword, newPassword } = req.body;
      const id = new ObjectId(String(req.body.user.account_id));
      const updatedStatus = await this.profileEditingService.changePassword(
        id,
        oldPassword,
        newPassword
      );

      if (!updatedStatus) {
        res.status(400).send({ message: "Failed to change password" });
        return;
      }

      res.status(200).send({ message: "Profile updated successfully" });
    } catch (error) {
      this.error(error, res);
    }
  }
}
