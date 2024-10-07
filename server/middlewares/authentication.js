const { getTokenFromHeaders } = require("../utils/token");
const jwt = require("jsonwebtoken");

// Middleware to authenticate the token - check if the token is valid
function authenticateToken(req, res, next) {
  const token = getTokenFromHeaders(req);

  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.SECRET_KEY, (error, payload) => {
    if (error) {
      // Check if the token has expired
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      return res.sendStatus(403);
    }
    req.user = payload;
    next();
  });
}

module.exports = authenticateToken;
