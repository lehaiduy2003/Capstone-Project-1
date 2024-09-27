const {
  userSignUp,
  userSignIn,
  getNewAccessToken,
} = require("../services/authService");
const { getTokenFromHeaders } = require("../utils/token");

async function signUp(req, res) {
  const { name, email, password } = req.body;
  // Validate input data
  if (!name || !email || !password) {
    return res.status(400).send({ error: "Invalid input data" });
  }
  try {
    const result = await userSignUp(name, email, password);
    if (!result) {
      return res.status(409).send({ error: "user already exist" });
    }
    // Generate tokens
    // const isSuccess = await saveTokensToDb(user._id, accessToken, refreshToken);
    // // if saving tokens to db fails, return 500
    // if (!isSuccess) {
    //   return res.sendStatus(500);
    // }

    return res.status(201).send({ data: result });
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

    const newAccessToken = getNewAccessToken(refreshToken);

    //const result = await modifyToken(req.user.sub, newAccessToken);

    // if (result.modifiedCount === 0) {
    //   return res.status(400).send({ error: "Can't refresh access token" });
    // }

    res.status(200).send({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
}

async function signIn(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ error: "Invalid input data" });
  }
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
