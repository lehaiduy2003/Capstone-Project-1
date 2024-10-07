const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
const commonOptions = { algorithm: "HS512" };

function getTokenFromHeaders(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  return token;
}

// function signToken(sub, iat, exp, iss, aud, role, expiresIn) {
//   const payload = {
//     sub: sub,
//     iat: iat,
//     exp: exp,
//     iss: iss,
//     aud: aud,
//     role: role
//   }
//   return jwt.sign(payload, process.env.SECRET_KEY, { algorithm: 'HS512' }, { expiresIn: expiresIn });
// }

function generateTokens(user) {
  //console.log(user);

  const now = Date.now();

  const refreshToken = jwt.sign(
    {
      sub: user._id,
      iat: now,
      exp: now + 30 * 24 * 60 * 60 * 1000, // 30 days
    },
    SECRET_KEY,
    commonOptions
  );

  const accessToken = jwt.sign(
    {
      sub: user._id,
      iat: now,
      exp: now + 24 * 60 * 60 * 1000, // 1 day
      iss: `http://${process.env.HOST}:${process.env.PORT}`,
      aud: "EcoTrade",
      role: "customer",
    },
    SECRET_KEY,
    commonOptions
  );

  return { refreshToken, accessToken };
}

/**
 *
 * @param {string} refreshToken - for generating new access token
 * (decoding the payload of the refresh token to get the user id)
 * @returns {string} newAccessToken - new access token
 */
function refreshToken(token) {
  const now = Date.now();
  const commonOptions = { algorithm: "HS512" };
  const payloadDecoded = jwt.verify(token, SECRET_KEY); // decode the token to get the information
  const newAccessToken = jwt.sign(
    {
      sub: payloadDecoded.sub,
      iat: now,
      exp: now + 24 * 60 * 60 * 1000, // 1 day
      iss: `http://${process.env.HOST}:${process.env.PORT}`,
      aud: "EcoTrade",
      role: "customer",
    },
    SECRET_KEY,
    commonOptions,
    {
      expiresIn: "1d",
    }
  );
  return newAccessToken;
}

module.exports = { getTokenFromHeaders, generateTokens, refreshToken };
