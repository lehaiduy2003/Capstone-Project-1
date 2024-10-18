import { Request, Response } from "express";

import BaseController from "./init/BaseController";
import AuthService from "../services/AuthService";

import getTokenFromHeaders from "../utils/getTokenFromHeader";
import { validateAccount } from "../libs/zod/model/Account";
import ServiceFactory from "../services/init/ServiceFactory";

export default class AuthController extends BaseController {
  private readonly authService: AuthService = ServiceFactory.createService(
    "auth",
  ) as AuthService;
  public async delete(req: Request, res: Response): Promise<void> {
    this.checkReqBody(req, res);
    try {
      const { id } = req.params;
      const result = await this.authService.delete("_id", id);

      if (result) {
        res.status(200).send({ message: "User deleted" });
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      this.error(error, res);
    }
  }
  /**
   * for creating a new user
   * @param req request body containing email, password, role
   * @param res response containing the created user
   */
  public override async post(req: Request, res: Response): Promise<void> {
    this.checkReqBody(req, res);
    try {
      const account = req.body;
      const result = await this.authService.create(account);

      if (!result || result === null) {
        res.status(400).send({ error: "No user created" });
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
  async generateNewAccessToken(req: Request, res: Response): Promise<void> {
    this.checkReqBody(req, res);
    try {
      const refreshToken = getTokenFromHeaders(req);

      if (!refreshToken) {
        res.status(403).send({ error: "No token provided" });
      } else {
        const newAccessToken = this.authService.getNewAccessToken(
          String(refreshToken),
        );
        res.status(200).send({ accessToken: newAccessToken });
      }
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
    this.checkReqBody(req, res);
    try {
      console.log(req.body);

      const parsedAccount = validateAccount(req.body);

      console.log(parsedAccount);

      const result = await this.authService.signIn(
        parsedAccount.email,
        parsedAccount.password,
      );

      if (!result || result === null) {
        res.status(502).send({ error: "Invalid credential" });
      } else res.status(200).send(result);
    } catch (error) {
      this.error(error, res);
    }
  }
}
