// server/controllers/authController.test.js
const { generateNewAccessToken } = require("../controllers/authController");
const { getNewAccessToken } = require("../services/authService");
const { getTokenFromHeaders } = require("../utils/token");

jest.mock("../services/authService");
jest.mock("../utils/token");

describe("generateNewAccessToken controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer refreshToken",
      },
      user: {
        sub: "userId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  test("should return 400 if refresh token is invalid", () => {
    getTokenFromHeaders.mockReturnValue(null);

    generateNewAccessToken(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: "Invalid refresh token" });
  });

  test("should return 200 and new access token if refresh is successful", () => {
    getTokenFromHeaders.mockReturnValue("refreshToken");
    getNewAccessToken.mockReturnValue("newAccessToken");

    generateNewAccessToken(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ accessToken: "newAccessToken" });
  });

  test("should return 500 if an internal server error occurs", () => {
    getTokenFromHeaders.mockImplementation(() => {
      throw new Error("Internal server error");
    });

    generateNewAccessToken(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
