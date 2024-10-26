import { Request, Response } from "express";

import BaseController from "./init/BaseController";
import AuthService from "../services/AuthService";

export default class AuthController extends BaseController {
  private readonly authService: AuthService;
  public constructor(authService: AuthService) {
    super();
    this.authService = authService;
  }
  /**
   * for creating a new user
   * @param req request body containing email, password, role
   * @param res response containing the created user
   */
  public async signUp(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const result = await this.authService.signUp(req.body);

      if (!result || result === null) {
        this.respond(res, 502, "No user created");
      } else this.respond(res, 201, "User created", result);
    } catch (error) {
      this.error(error, res);
    }
  }

  /**
   * Generate a new access token
   * @param req request header containing refresh token
   * @param res response containing the new access token
   */
  generateNewAccessToken(req: Request, res: Response): void {
    try {
      const newAccessToken = this.authService.getNewAccessToken(String(req.body.token));
      this.respond(res, 201, "New access token generated", newAccessToken);
    } catch (error) {
      this.error(error, res);
    }
  }

  /**
   * User sign in: check if the user exists and the password is correct
   * @param req request body containing email and password
   * @param res response containing the user info and tokens
   */
  async signIn(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const account = req.body;

      const result = await this.authService.signIn(account.email, account.password);

      if (!result || result === null) {
        res.status(502).send({ error: "Invalid credential" });
      } else res.status(200).send(result);
    } catch (error) {
      this.error(error, res);
    }
  }
}
