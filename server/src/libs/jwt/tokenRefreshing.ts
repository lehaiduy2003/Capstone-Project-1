import jwt from "jsonwebtoken";

import { commonOptions, SECRET_KEY } from "./keyAndOption";
import { Payload } from "../zod/Payload";
import decodeToken from "./tokenDecoding";

export default function refreshAccessToken(token: string): string {
  const payloadDecoded = decodeToken(token) as Payload;

  if (!payloadDecoded) {
    throw new Error("Invalid token");
  }

  const payload = {
    sub: payloadDecoded.sub,
    iat: Date.now(),
    role: String(payloadDecoded.role),
  };
  return jwt.sign(payload, SECRET_KEY, { ...commonOptions, expiresIn: "1d" });
}
