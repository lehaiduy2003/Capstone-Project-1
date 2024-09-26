const {
  userSignUp,
  generateTokens,
  verifyToken,
  refreshAccessToken,
} = require("../services/authService");
const getTokenFromHeaders = require("../utils/authHeader");

async function signUp(req, res) {
  const { name, email, password } = req.body;
  const user = await userSignUp(name, email, password);

  if (!user) {
    return res.status(409).send({ error: "User already exists" });
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
  res.status(401).send({ error: "Invalid token" });
}

//TD
async function signIn(req, res) {
  const { email, password } = req.body;

  try {
    // Call the userSignIn function from authService
    const result = await userSignIn(email, password);

    // Check if the result is valid
    if (!result) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    // Send the result (tokens and user info) to the client
    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
}

module.exports = { signUp, generateNewAccessToken, signIn };
