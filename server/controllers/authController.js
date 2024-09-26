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
  const user = await userSignUp(name, email, password);
  if (!user) {
    return res.status(409).send({ error: "User already exists" });
  } else {
    const { refreshToken, accessToken } = generateTokens(user);
    const isSuccess = await saveTokensToDb(user._id, accessToken, refreshToken);
    if (!isSuccess) {
      return res.sendStatus(500);
    }
    return res.status(201).send({ user, refreshToken, accessToken });
  }
}

async function generateNewAccessToken(req, res) {
  const refreshToken = getTokenFromHeaders(req);
  //console.log(req.user);
  const accessToken = refreshAccessToken(refreshToken);
  const result = await modifyToken(req.user.sub, accessToken);
  //console.log(result);
  if (result.modifiedCount !== 0) {
    return res.status(200).send({ accessToken: accessToken });
  } else return res.status(400).send({ error: `can't refresh access token` });
}

module.exports = { signUp, generateNewAccessToken };
