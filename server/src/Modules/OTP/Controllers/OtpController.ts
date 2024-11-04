import { Request, Response } from "express";
import BaseController from "../../../Base/BaseController";
import IOtpService from "../Services/Init/IOtpService";
import { OtpData, validateOtp } from "../../../libs/zod/OtpData";
import getCache from "../../../libs/redis/cacheGetting";

export default class OtpController extends BaseController {
  private readonly otpService: IOtpService;

  public constructor(otpService: IOtpService) {
    super();
    this.otpService = otpService;
  }

  public async sendOtp(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const validatedData: OtpData = validateOtp(req.body);
      await this.otpService.send(validatedData.identifier, validatedData.type);
      res.status(200).send({ message: "Otp sent" });
    } catch (error) {
      this.error(error, res);
    }
  }

  public async resendOtp(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const validatedData: OtpData = validateOtp(req.body);
      const cache = await getCache(validatedData.identifier);
      if (cache) {
        const cacheData = JSON.parse(cache);
        if (cacheData.type === validatedData.type) {
          res.status(200).send({ message: "Otp still valid" });
          return;
        }
      }

      await this.otpService.resend(req.body.identifier);
      res.status(200).send({ message: "Otp resent" });
    } catch (error) {
      this.error(error, res);
    }
  }

  public async verifyOtp(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const { otp } = req.body;
      const validatedData: OtpData = validateOtp(req.body);
      const result = await this.otpService.verify(
        validatedData.identifier,
        validatedData.type,
        otp,
      );
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
