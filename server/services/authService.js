
const { saveTokens, findToken, updateToken } = require("../repositories/tokenRepository");
const { createUser } = require("../repositories/userRepository");
const jwt = require('jsonwebtoken')
const { hashPassword } = require("../utils/password");
const { signToken } = require("../utils/token");

function userSignUp(name, email, password) {
  const hashedPassword = hashPassword(password);
  return createUser(name, email, hashedPassword);
}

function generateTokens(user) {
  console.log(user);

  const refreshToken = jwt.sign({
    sub: user._id,
    iat: Date.now(),
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  }, process.env.SECRET_KEY, { algorithm: "HS512" }, {
    expiresIn: '30d'
  });

  const accessToken = jwt.sign({
    sub: user._id,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 1 day
    iss: `http://${process.env.HOSTNAME}:${process.env.PORT}`,
    aud: 'EcoTrade',
    role: 'customer'
  }, process.env.SECRET_KEY, { algorithm: "HS512" }, {
    expiresIn: '1d'
  });

  const isSuccess = saveTokens(user._id, accessToken, refreshToken);
  return isSuccess ? { refreshToken, accessToken } : null;
}

function refreshAccessToken(refreshToken) {
  const payloadDecoded = jwt.verify(refreshToken, process.env.SECRET_KEY);
  const accessToken = jwt.sign({
    sub: payloadDecoded.sub,
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 1 day
    iss: `http://${process.env.HOSTNAME}:${process.env.PORT}`,
    aud: 'EcoTrade',
    role: 'customer'
  }, process.env.SECRET_KEY, { algorithm: "HS512" }, {
    expiresIn: '1d'
  });
  return accessToken
}

function modifyToken(userId, token) {
  return updateToken(userId, token);
}

function verifyToken(token) {
  const tokenFound = findToken(token);
  return tokenFound
}


module.exports = { userSignUp, generateTokens, verifyToken, refreshAccessToken, modifyToken };