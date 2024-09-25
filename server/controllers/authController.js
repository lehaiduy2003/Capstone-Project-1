const { userSignUp, generateTokens, verifyToken, refreshAccessToken } = require('../services/authService');
const getTokenFromHeaders = require('../utils/authHeader');

async function signUp(req, res) {
  const { name, email, password } = req.body;
  const user = await userSignUp(name, email, password);

  if (!user) {
    return res.status(409).send({ error: 'User already exists' });
  }

  const { refreshToken, accessToken } = generateTokens(user);
  res.status(201).send({ data: { user, refreshToken, accessToken } });
}

async function generateNewAccessToken(req, res) {
  const refreshToken = getTokenFromHeaders(req);

  if (await verifyToken(refreshToken)) {
    const accessToken = refreshAccessToken(refreshToken);
    return res.status(200).send({ data: { accessToken } });
  }
  res.status(401).send({ error: 'Invalid token' });
}

module.exports = { signUp, generateNewAccessToken };