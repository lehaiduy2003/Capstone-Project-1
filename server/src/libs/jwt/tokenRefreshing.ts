import { commonOptions, SECRET_KEY } from "./keyAndOption";
import { Payload } from "../zod/Payload";
import decodeToken from "./tokenDecoding";
import { sign } from "jsonwebtoken";

const refreshAccessToken = (id: string, role: string): string => {
  const payload = {
    sub: id,
    iat: Math.floor(Date.now() / 1000),
    role: role,
  };
  return sign(payload, SECRET_KEY, { ...commonOptions, expiresIn: "1d" });
};

export default refreshAccessToken;
