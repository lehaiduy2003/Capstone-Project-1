import { Request, Response } from "express";

import BaseController from "../../../Base/BaseController";
import AuthService from "../Services/AuthService";
import { validateSignUpDTO } from "../../../libs/zod/dto/SignUpDTO";

export default class AuthController extends BaseController {
  private readonly authService: AuthService;

  public constructor(authService: AuthService) {
    super();
    this.authService = authService;
  }

  public async activateAccount(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const { identifier, type } = req.body;
      // console.log(type);
      if (type !== "activate") {
        res.status(400).send({ error: "Invalid activate account request" });
        return;
      }
      const result = await this.authService.activateAccount(identifier);
      if (!result) {
        res.status(502).send({ error: "Cannot activate account status" });
      } else res.status(200).send(result);
    } catch (error) {
      this.error(error, res);
    }
  }

  public async deactivateAccount(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const { identifier, type } = req.body;
      // console.log(type);
      if (type !== "deactivate") {
        res.status(400).send({ error: "Invalid deactivate account request" });
        return;
      }
      const result = await this.authService.deactivateAccount(identifier);
      if (!result) {
        res.status(502).send({ error: "Cannot deactivate account status" });
      } else res.status(200).send(result);
    } catch (error) {
      this.error(error, res);
    }
  }

  /**
   * for creating a new user
   * @param req request body containing email, password, role
   * @param res response containing the created user
   */
  public async signUp(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res)) return;
    try {
      const accountData = validateSignUpDTO(req.body);
      // console.log("req.body", req.body);
      const result = await this.authService.signUp(accountData);
      // console.log("result", result);
      if (!result) {
        res.status(502).send({ error: "User already exists" });
      } else res.status(201).send(result);
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
      const newAccessToken = this.authService.getNewAccessToken(
        String(req.body.token),
      );
      res.status(201).send({ accessToken: newAccessToken });
      return;
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

      // console.log("account", account);

      const result = await this.authService.signIn(
        account.email,
        account.password,
      );
      // console.log("result", result);
      if (!result) {
        res.status(502).send({ error: "Invalid credential" });
      } else res.status(200).send(result);
    } catch (error) {
      this.error(error, res);
    }
  }
}
