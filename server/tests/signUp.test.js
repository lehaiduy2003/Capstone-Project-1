require("dotenv").config({ path: ".env.test" });

const { signUp } = require("../controllers/authController");
const {
  userSignUp,
  generateTokens,
  saveTokensToDb,
} = require("../services/authService");

jest.mock("../services/authService");

describe("signUp controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "test",
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  test("should return 409 if user already exists", async () => {
    userSignUp.mockResolvedValue(null);

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith({ error: "User already exists" });
  });

  test("should return 201 and tokens if sign up is successful", async () => {
    const user = { _id: "userId", name: "test" };
    const tokens = { refreshToken: "refreshToken", accessToken: "accessToken" };
    userSignUp.mockResolvedValue(user);
    generateTokens.mockReturnValue(tokens);
    saveTokensToDb.mockResolvedValue(true);

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      user,
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
    });
  });

  test("should return 500 if saving tokens to DB fails", async () => {
    const user = { _id: "userId", name: "test" };
    const tokens = { refreshToken: "refreshToken", accessToken: "accessToken" };
    userSignUp.mockResolvedValue(user);
    generateTokens.mockReturnValue(tokens);
    saveTokensToDb.mockResolvedValue(false);

    await signUp(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });

  test("should return 400 if input data is invalid", async () => {
    req.body = { name: "", email: "invalid-email", password: "" };

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: "Invalid input data" });
  });

  test("should return 500 if userSignUp throws an error", async () => {
    userSignUp.mockRejectedValue(new Error("Service error"));

    await signUp(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });

  test("should return 500 if generateTokens fails", async () => {
    const user = { _id: "userId", name: "test" };
    userSignUp.mockResolvedValue(user);
    generateTokens.mockImplementation(() => {
      throw new Error("Token generation error");
    });

    await signUp(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
