const { SECRET_ENCODED } = require("../constants/key");
const { saveTokens, findToken } = require("../repositories/tokenRepository");
const { createUser } = require("../repositories/userRepository");
const jwt = require('jsonwebtoken')
const { hashPassword } = require("../utils/password");

function userSignUp(name, email, password) {
  const hashedPassword = hashPassword(password);
  return createUser(name, email, hashedPassword);
}

function generateTokens(user) {

  const refreshToken = jwt.sign({
    sub: user._id,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  }, SECRET_ENCODED, { algorithm: "HS512" }, {
    expiresIn: '30d'
  });

  const accessToken = jwt.sign({
    iss: `http://${process.env.HOST}:${process.env.PORT}`,
    aud: 'EcoTrade',
    sub: user._id,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 1 day
    role: 'customer'
  }, SECRET_ENCODED, { algorithm: "HS512" }, {
    expiresIn: '1d'
  });

  const isSuccess = saveTokens(user.id, accessToken, refreshToken);
  return isSuccess ? { refreshToken, accessToken } : null;
}

function refreshAccessToken(refreshToken) {
  try {
    const payloadDecoded = jwt.verify(refreshToken, SECRET_ENCODED);
    const accessToken = jwt.sign({
      iss: `http://${process.env.HOST}:${process.env.PORT}`,
      aud: 'EcoTrade',
      sub: payloadDecoded.sub,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000, // 1 day
      role: 'customer'
    }, SECRET_ENCODED, { algorithm: "HS512" }, {
      expiresIn: '1d'
    });
    const isSuccess = saveTokens(payloadDecoded.sub, accessToken, refreshToken);
    return isSuccess ? accessToken : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

function verifyToken(token) {
  const tokenFound = findToken(token);
  return tokenFound
}


module.exports = { userSignUp, generateTokens, verifyToken, refreshAccessToken };