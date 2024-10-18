import jwt from "jsonwebtoken";
import { commonOptions, SECRET_KEY } from "./keyAndOption";

export default function generateTokens(id: string, role: string) {
  //console.log(user);

  const now = Date.now();

  const refreshToken = jwt.sign(
    {
      sub: id,
      iat: now,
    },
    SECRET_KEY,
    { ...commonOptions, expiresIn: "7d" },
  );

  const accessToken = jwt.sign(
    {
      sub: id,
      iat: now,
      role: role,
    },
    SECRET_KEY,
    { ...commonOptions, expiresIn: "1d" },
  );

  return { refreshToken, accessToken };
}
