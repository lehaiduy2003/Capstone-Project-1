import { Request, Response } from "express";
import BaseController from "./init/BaseController";
import IOtpService from "../services/init/IOtpService";
import { validateOtp } from "../libs/zod/OtpData";

export default class OtpController extends BaseController {
  private readonly otpService: IOtpService;

  public constructor(otpService: IOtpService) {
    super();
    this.otpService = otpService;
  }

  public async sendOtp(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const validBody = validateOtp(req.body);
      await this.otpService.sendOtp(validBody);
      res.status(200).send({ message: "Otp sent" });
    } catch (error) {
      this.error(error, res);
    }
  }

  public async verifyOtp(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const { identifier, otp } = req.body;
      const result = await this.otpService.verifyOtp(identifier, otp);
      if (result) {
        res.status(200).send({ message: "Otp verified" });
      } else {
        res.status(400).send({ message: "Invalid otp" });
      }
    } catch (error) {
      this.error(error, res);
    }
  }
}
