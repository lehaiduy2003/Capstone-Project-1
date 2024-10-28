import * as dotenv from "dotenv";
dotenv.config();

import setupMiddlewares from "./setup/setupMiddlewares";
import setupRouters from "./setup/setupRoutes";
import setupConnections from "./setup/setupConnections";

import express from "express";
const app = express();

setupMiddlewares(app);
setupRouters(app);

(async () => {
  try {
    await setupConnections();
  } catch (error) {
    console.error("Connect the server failed", error);
  }
})()
  .then(() => {
    app.listen(Number(process.env.PORT as string), () => {
      console.log(`The server is live!`);
    });
  })
  .catch((error) => async () => {
    console.error("Failed to start server", error);
  });
