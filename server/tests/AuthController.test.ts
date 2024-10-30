import { Request, Response } from "express";
import AuthController from "../src/Modules/Auth/Controllers/AuthController";
import AuthService from "../src/Modules/Auth/Services/AuthService";
import { validateAccount } from "../src/libs/zod/model/Account";

import { ObjectId } from "mongodb";

jest.mock("../src/Modules/Auth/Services/AuthService");
jest.mock("../src/libs/zod/model/Account");

describe("AuthController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let authControllerMock: AuthController;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(() => {
    req = {
      body: {},
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    authServiceMock = new AuthService() as jest.Mocked<AuthService>;
    authControllerMock = new AuthController() as jest.Mocked<AuthController>;
  });

  describe("signUp", () => {
    it("should create a new user successfully", async () => {
      const account = { email: "test@example.com", password: "password123456" };
      req.body = account;
      (validateAccount as jest.Mock).mockReturnValue(account);
      authServiceMock.signUp.mockResolvedValue(account);

      await authControllerMock.signUp(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User created" }),
      );
    });

    it("should handle user creation failure", async () => {
      const account = {
        email: "test@example.com",
        password: "password",
        role: "user",
      };
      req.body = account;
      (validateAccount as jest.Mock).mockReturnValue(account);
      authServiceMock.signUp.mockResolvedValue(null);

      await authControllerMock.signUp(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(502);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "No user created" }),
      );
    });

    it("should handle validation error", async () => {
      req.body = {};
      (validateAccount as jest.Mock).mockImplementation(() => {
        throw new Error("Validation error");
      });

      await authControllerMock.signUp(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Validation error" }),
      );
    });
  });

  describe("generateNewAccessToken", () => {
    it("should generate a new access token successfully", async () => {
      req.body = { token: "refreshToken" };
      authServiceMock.getNewAccessToken.mockReturnValue("newAccessToken");

      await authControllerMock.generateNewAccessToken(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "New access token generated" }),
      );
    });

    it("should handle token generation failure", async () => {
      req.body = { token: "invalidToken" };
      authServiceMock.getNewAccessToken.mockImplementation(() => {
        throw new Error("Token generation error");
      });

      await authControllerMock.generateNewAccessToken(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Token generation error" }),
      );
    });
  });

  describe("signIn", () => {
    it("should sign in successfully", async () => {
      const account = { email: "test@example.com", password: "password" };
      req.body = account;
      authServiceMock.signIn.mockResolvedValue({
        account_id: new ObjectId(),
        user_id: new ObjectId(),
        refreshToken: "someRefreshToken",
        accessToken: "accessToken",
      });

      await authControllerMock.signIn(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ user: account, token: "accessToken" }),
      );
    });

    it("should handle invalid credentials", async () => {
      const account = { email: "test@example.com", password: "wrongPassword" };
      req.body = account;
      authServiceMock.signIn.mockResolvedValue(null);

      await authControllerMock.signIn(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(502);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ error: "Invalid credential" }),
      );
    });

    it("should handle sign-in error", async () => {
      const account = { email: "test@example.com", password: "password" };
      req.body = account;
      authServiceMock.signIn.mockImplementation(() => {
        throw new Error("Sign-in error");
      });

      await authControllerMock.signIn(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Sign-in error" }),
      );
    });
  });
});
