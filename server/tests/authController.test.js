const {
  signUp,
  signIn,
  generateNewAccessToken,
} = require("../controllers/authController");
const { userSignUp, userSignIn } = require("../services/authService");
const { getNewAccessToken } = require("../services/authService");
const errorHandler = require("../middlewares/errorMiddleware");
const { getTokenFromHeaders } = require("../utils/tokens");
// server/controllers/authController.test.js

jest.mock("../services/authService");
jest.mock("../configs/database");
jest.mock("../utils/tokens");
jest.mock("../middlewares/errorMiddleware"); // Mock the errorHandler

describe("signUp", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      sendStatus: jest.fn(),
      json: jest.fn(), // Add the json method to the mock response object
    };
  });

  test("should return 400 if input data is missing", async () => {
    req.body = {}; // Missing input data

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: "Invalid input data" });
  });

  test("should return 409 if user already exists", async () => {
    userSignUp.mockResolvedValue(null); // Simulate user already exists

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith({ error: "User already exists" });
  });

  test("should return 201 and user data if sign-up is successful", async () => {
    const userData = {
      id: "userId",
      name: "John Doe",
      email: "john.doe@example.com",
    };
    userSignUp.mockResolvedValue(userData); // Simulate successful sign-up

    await signUp(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(userData);
  });

  test("should call the error handler if catch the error", async () => {
    const error = new Error("Internal server error");
    userSignUp.mockImplementation(() => {
      throw error;
    });

    await signUp(req, res);

    expect(errorHandler).toHaveBeenCalledWith(error, req, res); // Verify that next is called with an error
  });
});

describe("signIn", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "john.doe@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      sendStatus: jest.fn(),
      json: jest.fn(), // Add the json method to the mock response object
    };
  });

  test("should return 400 if email or password is missing", async () => {
    req.body = { email: "", password: "" };

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: "Invalid input data" });
  });

  test("should return 401 if credentials are invalid", async () => {
    req.body = { email: "test@example.com", password: "password" };
    userSignIn.mockResolvedValue(null);

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  test("should return 200 and user data if sign-in is successful", async () => {
    const userData = {
      id: "userId",
      name: "John Doe",
      email: "john.doe@example.com",
      accessToken: "accessToken",
      refreshToken: "refreshToken",
    };
    userSignIn.mockResolvedValue(userData); // Simulate successful sign-in

    await signIn(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(userData);
  });

  test("should call the error handler if an error occurs", async () => {
    const error = new Error("Internal server error");
    userSignIn.mockImplementation(() => {
      throw error;
    });

    await signIn(req, res);

    expect(errorHandler).toHaveBeenCalledWith(error, req, res); // Verify that errorHandler is called with an error
  });
});

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
      json: jest.fn(), // Add the json method to the mock response object
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

  test("should return 500 if an internal server error occurs", async () => {
    const error = new Error("Internal server error");
    getTokenFromHeaders.mockImplementation(() => {
      throw error;
    });

    await generateNewAccessToken(req, res);

    expect(errorHandler).toHaveBeenCalledWith(error, req, res); // Verify that errorHandler is called with the error
  });
});
