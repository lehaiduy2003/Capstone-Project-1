import { sign } from "jsonwebtoken";
import { commonOptions, SECRET_KEY } from "./keyAndOption";

const generateTokens = (id: string, role: string) => {
  //console.log(user);

  const now = Date.now();

  const refreshToken = sign(
    {
      sub: id,
      iat: now,
    },
    SECRET_KEY,
    { ...commonOptions, expiresIn: "7d" }
  );

  const accessToken = sign(
    {
      sub: id,
      iat: now,
      role: role,
    },
    SECRET_KEY,
    { ...commonOptions, expiresIn: "1d" }
  );

  return { refreshToken, accessToken };
};

export default generateTokens;
