const jwt = require('jsonwebtoken')

function getTokenFromHeaders(req) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  return token
}

function signToken(sub, iat, exp, iss, aud, role, expiresIn) {
  const payload = {
    sub: sub,
    iat: iat,
    exp: exp,
    iss: iss,
    aud: aud,
    role: role
  }
  return jwt.sign(payload, process.env.SECRET_KEY, { algorithm: 'HS512' }, { expiresIn: expiresIn });
}

module.exports = { getTokenFromHeaders, signToken };