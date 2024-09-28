require("dotenv").config({ path: ".env.test" });
const { generateNewAccessToken } = require("../controllers/authController");
const { refreshAccessToken, modifyToken } = require("../services/authService");
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
    };
  });

  test("should return 200 and new access token if refresh is successful", async () => {
    getTokenFromHeaders.mockReturnValue("refreshToken");
    refreshAccessToken.mockReturnValue("newAccessToken");
    modifyToken.mockResolvedValue({ modifiedCount: 1 });

    await generateNewAccessToken(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ accessToken: "newAccessToken" });
  });

  test("should return 400 if refresh token is invalid", async () => {
    getTokenFromHeaders.mockReturnValue("invalidRefreshToken");
    refreshAccessToken.mockReturnValue(null);
    modifyToken.mockResolvedValue({ modifiedCount: 0 });

    await generateNewAccessToken(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      error: "Can't refresh access token",
    });
  });

  test("should return 500 if modifyToken throws an error", async () => {
    getTokenFromHeaders.mockReturnValue("refreshToken");
    refreshAccessToken.mockReturnValue("newAccessToken");
    modifyToken.mockRejectedValue(new Error("Database error"));

    await generateNewAccessToken(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
