import { Application } from "express";
import createOtpRouter from "../routers/OtpRouter";
import createPaymentRouter from "../routers/PaymentRouter";
import createTransactionRouter from "../routers/TransactionRouter";
import createAuthRouter from "../routers/AuthRouter";
import createUserRouter from "../routers/UserRouter";
import createProductRouter from "../routers/ProductRouter";
import createProfileEditingRouter from "../routers/ProfileEditingRouter";

const setupRouters = (app: Application): void => {
  createAuthRouter().register("/auth", app);
  createUserRouter().register("/users", app);
  createOtpRouter().register("/otp", app);
  createPaymentRouter().register("/payments", app);
  createTransactionRouter().register("/transactions", app);
  createProductRouter().register("/products", app);
  createProfileEditingRouter().register("/profile", app);
  console.log("Routers initialized");
};

export default setupRouters;
