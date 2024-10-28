import { Request } from "express";

const getTokenFromHeaders = (req: Request): string | undefined => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  return token;
};

export default getTokenFromHeaders;
