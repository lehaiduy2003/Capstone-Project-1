// server/controllers/authController.test.js
const { signUp } = require("../controllers/authController");
const { userSignUp } = require("../services/authService");

jest.mock("../services/authService");
jest.mock("../configs/database");
describe("signUp controller", () => {
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

  test("should return 500 if an internal server error occurs", async () => {
    userSignUp.mockImplementation(() => {
      throw new Error("Internal server error");
    });

    await signUp(req, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
