import cors from "cors";
import cookieParser from "cookie-parser";
import { Application, json, urlencoded } from "express";

const setupMiddlewares = (app: Application): void => {
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(json());
  app.use(cookieParser());
  app.use(
    urlencoded({
      extended: true,
    })
  );
};

export default setupMiddlewares;
