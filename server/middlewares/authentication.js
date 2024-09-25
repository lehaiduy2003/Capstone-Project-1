const jwt = require('jsonwebtoken');
const { SECRET_ENCODED } = require('../constants/key');
const getTokenFromHeaders = require('../utils/authHeader');

function authenticateToken(req, res, next) {

  const token = getTokenFromHeaders(req);

  if (token === null || token === undefined) {
    console.log('token null');
    return res.sendStatus(401)
  }
  console.log('token: ', token);
  next()

}

module.exports = authenticateToken;
