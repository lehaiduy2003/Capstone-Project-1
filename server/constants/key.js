const crypto = require('crypto');
exports.SECRET_ENCODED = crypto.createHash('sha256').update(`${process.env.SECRET_KEY}`).digest('base64');
