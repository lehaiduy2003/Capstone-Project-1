const {
  userSignUp,
  generateTokens,
  refreshAccessToken,
  modifyToken,
  saveTokensToDb,
} = require("../services/authService");
const { getTokenFromHeaders } = require("../utils/token");

async function signUp(req, res) {
  const { name, email, password } = req.body;
  // Validate input data
  if (!name || !email || !password) {
    return res.status(400).send({ error: "Invalid input data" });
  }
  try {
    const user = await userSignUp(name, email, password);
    if (!user) {
      return res.status(409).send({ error: "User already exists" });
    }
    // Generate tokens
    const { refreshToken, accessToken } = generateTokens(user);
    const isSuccess = await saveTokensToDb(user._id, accessToken, refreshToken);
    // if saving tokens to db fails, return 500
    if (!isSuccess) {
      return res.sendStatus(500);
    }

    return res.status(201).send({ user, refreshToken, accessToken });
  } catch (error) {
    return res.sendStatus(500);
  }
}

async function generateNewAccessToken(req, res) {
  try {
    const refreshToken = getTokenFromHeaders(req);

    if (!refreshToken) {
      return res.status(400).send({ error: "Invalid refresh token" });
    }

    const newAccessToken = refreshAccessToken(refreshToken);

    const result = await modifyToken(req.user.sub, newAccessToken);

    if (result.modifiedCount === 0) {
      return res.status(400).send({ error: "Can't refresh access token" });
    }

    res.status(200).send({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
}

module.exports = { signUp, generateNewAccessToken };
