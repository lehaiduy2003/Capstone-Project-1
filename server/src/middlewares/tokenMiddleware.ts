import { NextFunction, Request, Response } from "express";

import getTokenFromHeaders from "../utils/getTokenFromHeader";

import errorHandler from "./errorMiddleware";

import verifyToken from "../libs/jwt/tokenVerifying";
import decodeToken from "../libs/jwt/tokenDecoding";

// Middleware to validate the token - check if the token is valid
const validateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = getTokenFromHeaders(req);

  try {
    if (!token) {
      res.status(401).send({ message: "no token provided" });
      return;
    }

    const checkToken = verifyToken(token);

    if (checkToken === 0) {
      res.status(403).send({ message: "Token is expired" });
      return;
    }

    if (checkToken === -1) {
      res.status(403).send({ message: "Invalid token" });
      return;
    }

    req.body.user = decodeToken(token);
    // console.log("req.body.user", req.body.user);
    req.body.token = token;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
};

export default validateToken;
