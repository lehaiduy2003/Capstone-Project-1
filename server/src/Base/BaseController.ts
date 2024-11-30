import { Request, Response } from "express";

import errorHandler from "../middlewares/errorMiddleware";

export default class BaseController {
  protected constructor() {}

  // protected checkReqHeaders(req: Request, res: Response): boolean {
  //   if (!req.headers) {
  //     res.status(400).send({ error: "invalid headers" });
  //     return false;
  //   }
  //   return true;
  // }

  protected checkReqBody(req: Request, res: Response): boolean {
    if (!req.body) {
      res.status(400).send({ error: "invalid body" });
      return false;
    }
    return true;
  }

  // for checking request params (id, etc.)
  protected checkReqParams(req: Request, res: Response): boolean {
    if (!req.params) {
      res.status(400).send({ error: "invalid params" });
      return false;
    }
    return true;
  }

  // for checking query parameters (sort, order, limit, etc.)
  protected checkReqQuery(req: Request, res: Response): boolean {
    if (!req.query) {
      res.status(400).send({ error: "invalid query" });
      return false;
    }
    return true;
  }

  // protected checkReqCookies(req: Request, res: Response): boolean {
  //   if (!req.cookies) {
  //     res.status(400).send({ error: "invalid cookies" });
  //     return false;
  //   }
  //   return true;
  // }

  protected error(error: any, res: Response): void {
    errorHandler(error, res);
  }
}
