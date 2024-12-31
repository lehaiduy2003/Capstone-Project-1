import * as dotenv from "dotenv";
dotenv.config();

import setupMiddlewares from "./setup/setupMiddlewares";
import setupRouters from "./setup/setupRoutes";
import setupConnections from "./setup/setupConnections";
import cron from "node-cron";
import express from "express";
import { backupDatabase } from "./backup";
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
    // Schedule the cron job to run every day at 11 PM
    console.log("Start scheduling the backup job");
    cron.schedule("0 23 * * *", backupDatabase);
  })
  .catch((error) => async () => {
    console.error("Failed to start server", error);
  });
