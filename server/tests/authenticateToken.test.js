const authenticateToken = require("../middlewares/authentication");
const { getTokenFromHeaders } = require("../utils/token");
const jwt = require("jsonwebtoken");

jest.mock("../utils/token");
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
    const expiredPayload = { id: 1, name: "test", exp: Date.now() - 1000 }; // expired 1 second ago

    getTokenFromHeaders.mockReturnValue("expired_token");
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback({ name: "TokenExpiredError" }, expiredPayload);
    });

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Token has expired",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 403 if token is invalid", () => {
    getTokenFromHeaders.mockReturnValue("invalid_token");
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("invalid token"), null);
    });

    authenticateToken(req, res, next);

    expect(res.sendStatus).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("should call next if token is valid", () => {
    const validPayload = { id: 1, name: "test" };

    getTokenFromHeaders.mockReturnValue("valid_token");
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, validPayload);
    });

    authenticateToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(validPayload);
  });
});
