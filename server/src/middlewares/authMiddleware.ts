import { NextFunction, Request, Response } from "express";

import getTokenFromHeaders from "../utils/getTokenFromHeader";

import errorHandler from "./errorMiddleware";

import verifyToken from "../libs/jwt/tokenVerifying";
import decodeToken from "../libs/jwt/tokenDecoding";

// Middleware to authenticate the token - check if the token is valid
export default function authenticateToken(req: Request, res: Response, next: NextFunction): void {
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

    const payload = decodeToken(token);
    req.body.user = payload;
    req.body.token = token;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
}
