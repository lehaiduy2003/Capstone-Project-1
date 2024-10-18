const {
  makeTransaction,
  changeTransactionStatus,
} = require("../controllers/transactionController");
const {
  createTransaction,
  updateTransactionStatus,
} = require("../services/transactionService");
const errorHandler = require("../middlewares/errorMiddleware");

jest.mock("../services/transactionService");
jest.mock("../middlewares/errorMiddleware");

describe("makeTransaction controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      sendStatus: jest.fn(),
    };
  });

  test("should return 400 if products, buyer, or seller is missing", async () => {
    req.body = { products: null, buyer: null, seller: null };

    await makeTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: "invalid data provided" });
  });

  test("should return 502 if no transaction is created", async () => {
    req.body = { products: ["product1"], buyer: "buyer1", seller: "seller1" };
    createTransaction.mockResolvedValue(null);

    await makeTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.send).toHaveBeenCalledWith({ error: "No transaction created" });
  });

  test("should return 201 and the transaction if creation is successful", async () => {
    const transaction = { id: "transaction1" };
    req.body = { products: ["product1"], buyer: "buyer1", seller: "seller1" };
    createTransaction.mockResolvedValue(transaction);

    await makeTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(transaction);
  });

  test("should call errorHandler if an internal server error occurs", async () => {
    const error = new Error("Internal server error");
    req.body = { products: ["product1"], buyer: "buyer1", seller: "seller1" };
    createTransaction.mockImplementation(() => {
      throw error;
    });

    await makeTransaction(req, res);

    expect(errorHandler).toHaveBeenCalledWith(error, req, res);
  });
});
describe("changeTransactionStatus controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  test("should return 400 if id or status is missing", async () => {
    req.body = { status: null };
    req.params = { id: null };

    await changeTransactionStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: "invalid data provided" });
  });

  test("should return 502 if no transaction is updated", async () => {
    req.body = { status: "completed" };
    req.params = { id: "transaction1" };
    updateTransactionStatus.mockResolvedValue(null);

    await changeTransactionStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.send).toHaveBeenCalledWith({ error: "No transaction updated" });
  });

  test("should return 200 and the updated transaction if update is successful", async () => {
    const updatedTransaction = { id: "transaction1", status: "completed" };
    req.body = { status: "completed" };
    req.params = { id: "transaction1" };
    updateTransactionStatus.mockResolvedValue(updatedTransaction);

    await changeTransactionStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(updatedTransaction);
  });

  test("should call errorHandler if an internal server error occurs", async () => {
    const error = new Error("Internal server error");
    req.body = { status: "completed" };
    req.params = { id: "transaction1" };
    updateTransactionStatus.mockImplementation(() => {
      throw error;
    });

    await changeTransactionStatus(req, res);

    expect(errorHandler).toHaveBeenCalledWith(error, req, res);
  });
});
