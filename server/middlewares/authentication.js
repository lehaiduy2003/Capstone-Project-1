
const { getTokenFromHeaders } = require('../utils/token');
const jwt = require('jsonwebtoken');

// Middleware to authenticate the token - check if the token is valid
function authenticateToken(req, res, next) {

  const token = getTokenFromHeaders(req);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_KEY, (error, payload) => {
    if (error || !payload) {
      console.log(error);
      return res.sendStatus(403)
    }

    // Check expire time of the JWT (exp: milliseconds)
    if (payload.exp && Date.now() > payload.exp) {
      return res.sendStatus(401)
    }
    req.user = payload
    next()
  })
}

module.exports = authenticateToken;
