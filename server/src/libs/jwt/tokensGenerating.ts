import { sign } from "jsonwebtoken";
import { commonOptions, SECRET_KEY } from "./keyAndOption";
import { v4 as uuidv4 } from "uuid";
const generateTokens = (id: string, role: string) => {
  //console.log(user);

  const now = Math.floor(Date.now() / 1000); // in seconds
  const tokenId = uuidv4(); // Generate a unique identifier for the token

  const refreshToken = sign(
    {
      sub: id,
      iat: now,
      jti: tokenId,
    },
    SECRET_KEY,
    { ...commonOptions, expiresIn: "7d" }
  );

  const accessToken = sign(
    {
      sub: id,
      iat: now,
      role: role,
      jti: tokenId,
    },
    SECRET_KEY,
    { ...commonOptions, expiresIn: "1d" }
  );

  return { refreshToken, accessToken };
};

export default generateTokens;
