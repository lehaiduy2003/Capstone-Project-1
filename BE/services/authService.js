//const { insertToken, updateToken } = require("../repositories/tokenRepository");
const { insertUser, checkUser } = require("../repositories/userRepository");

const { hashPassword, verifyPassword } = require("../utils/password");
const { generateTokens, refreshToken } = require("../utils/token");

async function userSignUp(email, password) {
  const hashedPassword = hashPassword(password);
  try {
    const newUser = await insertUser(email, hashedPassword);
    if (!newUser) {
      return null;
    }
    const { refreshToken, accessToken } = generateTokens(newUser);
    return { newUser, refreshToken, accessToken };
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
}

// function saveTokensToDb(userId, accessToken, refreshToken) {
//   return insertToken(userId, accessToken, refreshToken);
// }

// function modifyToken(userId, token) {
//   return updateToken(userId, token);
// }

// function verifyToken(token) {
//   const tokenFound = findToken(token);
//   return tokenFound
// }
function getNewAccessToken(token) {
  return refreshToken(token);
}

async function userSignIn(email, password) {
  try {
    const user = await checkUser(email); // Sử dụng userRepository

    if (!user) {
      return null; // User không tồn tại
    }

    const [salt, hash] = user.password.split(":");
    const isPasswordValid = verifyPassword(password, salt, hash); // Sử dụng utils/password

    if (!isPasswordValid) {
      return null; // Mật khẩu không đúng
    }

    const { refreshToken, accessToken } = generateTokens(user);
    return { user, refreshToken, accessToken };
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
}

module.exports = {
  userSignUp,
  getNewAccessToken,
  userSignIn,
};
