import { Request } from "express";

export default function getTokenFromHeaders(req: Request): string | undefined {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  return token;
}
