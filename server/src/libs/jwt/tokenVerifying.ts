import { JsonWebTokenError, verify } from "jsonwebtoken";

import { SECRET_KEY } from "./keyAndOption";
/**
 * verify is valid token or not, return 1 if valid, -1 if not valid, 0 if expired
 * @param {string} token
 * @returns {-1 | 0 | 1}
 */
const verifyToken = (token: string): 1 | 0 | -1 => {
  try {
    verify(token, SECRET_KEY);
    return 1; // Token is valid
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      if (error.name === "TokenExpiredError") {
        return 0; // Token has expired
      }
      return -1; // Unauthorized
    }
    throw error; // Re-throw unexpected errors
  }
};

export default verifyToken;
