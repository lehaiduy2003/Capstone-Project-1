import { Request, Response } from "express";

export default interface IController {
  get(req: Request, res: Response): Promise<void>;
  post(req: Request, res: Response): Promise<void>;
  put(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
  patch(req: Request, res: Response): Promise<void>;
}
