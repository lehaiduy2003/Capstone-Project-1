const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');

  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

  return `${salt}:${hash}`
}

/**
 * Verifies if the password of the user is correct
 * @param {string} password - password to verify (input by the user)
 * @param {string} salt - salt of the password (from the database)
 * @param {string} hash - hash of the password (from the database)
 * @returns {boolean} - true if the password is correct, false otherwise
 */
function verifyPassword(password, salt, hash) {
  const hashToVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hashToVerify === hash;
}

module.exports = { hashPassword, verifyPassword };