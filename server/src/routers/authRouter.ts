import authenticateToken from "../middlewares/authMiddleware";
import express, { Request, Response } from "express";
import AuthController from "../controllers/AuthController";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/sign-up", async (req: Request, res: Response) => {
  console.log("POST /sign-up");
  authController.post(req, res);
});

authRouter.post(
  "/refresh",
  authenticateToken,
  async (req: Request, res: Response) => {
    console.log("POST /refresh");
    await authController.generateNewAccessToken(req, res);
  },
);

authRouter.post("/sign-in", async (req: Request, res: Response) => {
  console.log("POST /sign-in");
  await authController.signIn(req, res);
});

authRouter.delete(
  "/:id/delete",
  authenticateToken,
  async (req: Request, res: Response) => {
    console.log("DELETE /:id/delete");
    await authController.delete(req, res);
  },
);

export default authRouter;
