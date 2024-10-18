const authenticateToken = require("../middlewares/authMiddleware");
const { getTokenFromHeaders, verifyToken } = require("../utils/tokens");
const jwt = require("jsonwebtoken");

jest.mock("../utils/tokens");
jest.mock("jsonwebtoken");

describe("authenticateToken middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    };
    next = jest.fn();
  });

  test("should return 403 if no token is provided", () => {
    getTokenFromHeaders.mockReturnValue(null);

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if token is expired", () => {
    getTokenFromHeaders.mockReturnValue("expiredToken");
    verifyToken.mockReturnValue(0);

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token has expired",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if token is invalid", () => {
    getTokenFromHeaders.mockReturnValue("invalidToken");
    verifyToken.mockReturnValue(-1);

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token!" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next if token is valid", () => {
    const validPayload = { id: 1, name: "test" };
    getTokenFromHeaders.mockReturnValue("validToken");
    verifyToken.mockReturnValue(1);
    jwt.decode.mockReturnValue(validPayload);

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(validPayload);
  });
});
