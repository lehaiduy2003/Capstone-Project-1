import { Request, Response } from "express";
import BaseController from "./init/BaseController";
import IOtpService from "../services/init/IOtpService";

export default class OtpController extends BaseController {
  private readonly otpService: IOtpService;
  public constructor(otpService: IOtpService) {
    super();
    this.otpService = otpService;
  }
  public async sendOtp(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const { identifier } = req.body;
      await this.otpService.sendOtp(identifier);
      this.respond(res, 200, "Otp sent");
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
        this.respond(res, 200, "Otp verified");
      } else {
        this.respond(res, 401, "Otp verification failed");
      }
    } catch (error) {
      this.error(error, res);
    }
  }
}
