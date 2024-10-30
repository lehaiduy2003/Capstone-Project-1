import { Application } from "express";
import createOtpRouter from "../Modules/OTP/Routers/OtpRouter";
import createTransactionRouter from "../Modules/Transaction/Routers/TransactionRouter";
import createAuthRouter from "../Modules/Auth/Routers/AuthRouter";
import createUserRouter from "../Modules/UserProfile/Routers/UserProfileRouter";
import createProductRouter from "../Modules/Product/Routers/ProductRouter";
import createProfileEditingRouter from "../Modules/UserProfile/Routers/ProfileEditingRouter";
import createStripeRouter from "../Modules/Stripe/Routers/StripeRouter";

const setupRouters = (app: Application): void => {
  createAuthRouter().register("/auth", app);
  createUserRouter().register("/users", app);
  createOtpRouter().register("/otp", app);
  createStripeRouter().register("/stripe", app);
  createTransactionRouter().register("/transactions", app);
  createProductRouter().register("/products", app);
  createProfileEditingRouter().register("/profile", app);
  console.log("Routers initialized");
};

export default setupRouters;
