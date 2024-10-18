// server/routers/homeRouter.js

import PaymentController from "../controllers/PaymentController";
import ProductController from "../controllers/ProductController";
import TransactionController from "../controllers/TransactionController";

import authenticateToken from "../middlewares/authMiddleware";
import checkCache from "../middlewares/cacheMiddleware";

import express, { Request, Response } from "express";
const apiRouter = express.Router();
const paymentController = new PaymentController();
const productController = new ProductController();
const transactionController = new TransactionController();

apiRouter.get(
  "/products",
  authenticateToken,
  async (req: Request, res: Response) => {
    console.log("GET /products");
    await productController.get(req, res);
  },
);

apiRouter.get(
  "/products/search",
  authenticateToken,
  checkCache,
  async (req: Request, res: Response) => {
    console.log("GET /products/search");
    await productController.search(req, res);
  },
);

apiRouter.post("/checkout", authenticateToken, async (req, res) => {
  console.log("POST /checkout");
  await paymentController.post(req, res);
});

apiRouter.post("/transactions", authenticateToken, async (req, res) => {
  console.log("POST /transactions");
  await transactionController.post(req, res);
});

apiRouter.patch("/transactions/:id", authenticateToken, async (req, res) => {
  console.log("PATCH /transactions/:id");
  await transactionController.put(req, res);
});

export default apiRouter;
