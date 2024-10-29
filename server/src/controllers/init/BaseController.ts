import { Request, Response } from "express";

import errorHandler from "../../middlewares/errorMiddleware";

export default class BaseController {
  protected constructor() {}

  protected checkReqBody(req: Request, res: Response): boolean {
    if (!req.body) {
      res.status(400).send({ error: "invalid body" });
      return false;
    }
    return true;
  }

  protected checkReqParams(req: Request, res: Response): boolean {
    if (!req.params) {
      res.status(400).send({ error: "invalid params" });
      return false;
    }
    return true;
  }

  protected error(error: any, res: Response): void {
    errorHandler(error, res);
  }
}
