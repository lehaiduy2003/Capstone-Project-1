const { insertToken, updateToken } = require("../repositories/tokenRepository");
const { insertUser } = require("../repositories/userRepository");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../utils/password");

function userSignUp(name, email, password) {
  const hashedPassword = hashPassword(password.toString());
  return insertUser(name, email, hashedPassword);
}

const SECRET_KEY = process.env.SECRET_KEY;
const commonOptions = { algorithm: "HS512" };

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
      iss: `http://${process.env.HOSTNAME}:${process.env.PORT}`,
      aud: "EcoTrade",
      role: "customer",
    },
    SECRET_KEY,
    commonOptions
  );

  return { refreshToken, accessToken };
}

function saveTokensToDb(userId, accessToken, refreshToken) {
  return insertToken(userId, accessToken, refreshToken);
}

function refreshAccessToken(refreshToken) {
  const now = Date.now();
  const commonOptions = { algorithm: "HS512" };
  const payloadDecoded = jwt.verify(refreshToken, SECRET_KEY); // decode the token to get the information
  const newAccessToken = jwt.sign(
    {
      sub: payloadDecoded.sub,
      iat: now,
      exp: now + 24 * 60 * 60 * 1000, // 1 day
      iss: `http://${process.env.HOSTNAME}:${process.env.PORT}`,
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

function modifyToken(userId, token) {
  return updateToken(userId, token);
}

// function verifyToken(token) {
//   const tokenFound = findToken(token);
//   return tokenFound
// }

module.exports = {
  userSignUp,
  generateTokens,
  refreshAccessToken,
  modifyToken,
  saveTokensToDb,
};
