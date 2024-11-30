import cors from "cors";
import cookieParser from "cookie-parser";
import { Application, json, urlencoded } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

const setupMiddlewares = (app: Application): void => {
  // Set trust proxy to a more restrictive value
  app.set("trust proxy", "loopback");
  // Using helmet middleware to secure the app by setting various HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Turn off CSP if not need for mobile app
      frameguard: false, // Turn off frameguard if your API does not need it (e.g. APIs that serve images, mobile apps, etc.)
      referrerPolicy: { policy: "no-referrer" }, // Set referrerPolicy to no-referrer
    })
  );
  // Using cors middleware to allow all origins
  app.use(
    cors({
      origin: "*",
    })
  );
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 requests per windowMs
    message: "Too many requests from this IP, please try again after a minute",
  });
  // Using rateLimit middleware to limit repeated requests to public APIs
  app.use(limiter);
  // Using json for parsing application/json
  app.use(json());
  // Using cookieParser for parsing cookies
  app.use(cookieParser());
  // Using urlencoded for parsing application/x-www-form-urlencoded
  app.use(
    urlencoded({
      extended: true,
    })
  );
  // Using express-mongo-sanitize to sanitize user input to prevent MongoDB Operator Injection
  app.use(ExpressMongoSanitize());
  // Using hpp to prevent HTTP Parameter Pollution attacks
  app.use(hpp());
};

export default setupMiddlewares;
