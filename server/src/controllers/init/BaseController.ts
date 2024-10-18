import { Request, Response } from "express";

import IController from "./IController";
import errorHandler from "../../middlewares/errorMiddleware";

export default abstract class BaseController implements IController {
  async patch(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async get(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async post(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async put(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async delete(req: Request, res: Response): Promise<void> {
    throw new Error("Method not implemented.");
  }
  public checkReqBody(req: Request, res: Response): void {
    if (!req.body) {
      res.status(400).send({ error: "invalid body" });
    }
  }
  public checkReqParams(req: Request, res: Response): void {
    if (!req.params) {
      res.status(400).send({ error: "invalid params" });
    }
  }
  public error(error: any, res: Response) {
    errorHandler(error, res);
  }
}
