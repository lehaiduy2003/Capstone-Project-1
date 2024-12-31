import { NextFunction, Request, Response } from "express";
import UserProfileService from "../Modules/UserProfile/Services/UserProfileService";
import { ObjectId } from "mongodb";
import errorHandler from "./errorMiddleware";
import getUserIdFromBody from "../utils/getUserIdFromBody";
import getTokenFromHeaders from "../utils/getTokenFromHeader";
import verifyToken from "../libs/jwt/tokenVerifying";
import AuthService from "../Modules/Auth/Services/AuthService";
import AccountService from "../Modules/Account/Services/AccountService";
import decodeToken from "../libs/jwt/tokenDecoding";
import jwt from "jsonwebtoken";
import saveToCache from "../libs/redis/cacheSaving";
import getCache from "../libs/redis/cacheGetting";
/**
 * For validating the token provided by the user with the user's account id.
 * ```If the token does not belong to the user, it will return 404```
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express NextFunction
 */
export const authenticateUserByReqParams = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const account_id = req.body.user.sub; // sub is the accountId from the token
  // Using regex to get the user_id from the URL by matching the /users/, /owner/, /transactions/, etc. and the next string
  const user_id_match = req.originalUrl.match(/\/(?:users|owner|transactions)\/([^\/?]+)/);
  const user_id = user_id_match ? user_id_match[1] : null;
  if (!user_id || !account_id) {
    res.status(401).send({ success: false, message: "Invalid user_id or account_id" });
    return;
  }
  // console.log("userId", userId);
  // console.log("accountId", accountId);

  try {
    if (!authenticate(new ObjectId(String(user_id)), String(account_id))) {
      res.status(401).send({ success: false, message: "Invalid user" });
      return;
    }

    req.body.user_id = user_id;
    next();
  } catch (error) {
    errorHandler(error, res);
  }
};

export const authenticateUserByReqBody = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const account_id = req.body.user.sub; // sub is the accountId from the token
  const user_id = getUserIdFromBody(req);
  if (!user_id || !account_id) {
    res.status(401).send({ success: false, message: "Invalid user_id or account_id" });
    return;
  }
  // console.log("user_id", user_id);
  // console.log("account_id", account_id);

  try {
    if (!authenticate(new ObjectId(String(user_id)), String(account_id))) {
      res.status(401).send({ success: false, message: "Invalid user" });
      return;
    }
    next();
  } catch (error) {
    errorHandler(error, res);
  }
};

const authenticate = async (user_id: ObjectId, account_id: string) => {
  const userProfileService = new UserProfileService();
  const user = await userProfileService.findById(user_id);
  if (!user) {
    return false;
  }
  if (user.account_id.toString() !== account_id) {
    return false;
  }
  return true;
};

const UserService = new UserProfileService();
const accountService = new AccountService();
const authService = new AuthService(accountService, UserService);

export const setCookies = (res: Response, accessToken: string, refreshToken: string): void => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
    secure: process.env.NODE_ENV === "production", // secure: true in production for HTTPS to prevent CSRF
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // sameSite: "strict" in production to prevent CSRF
    path: "/",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Ensures the cookie is sent only over HTTP(S), not client JavaScript
    secure: process.env.NODE_ENV === "production", // secure: true in production for HTTPS to prevent CSRF
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // sameSite: "strict" in production for HTTPS to prevent CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const checkTokens = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = (await req.cookies["refreshToken"]) || req.headers["x-refresh-token"];
  const accessToken = (await req.cookies["accessToken"]) || getTokenFromHeaders(req);
  // console.log("accessToken", accessToken);
  // console.log("refreshToken", refreshToken);

  if (accessToken) {
    // const decoded = decodeToken(accessToken);
    // if (!decoded.jti) {
    //   clearCookies(req, res);
    //   res.status(403).send({ success: false, message: "Invalid token" });
    //   return;
    // }
    // if (await isTokenRevoked(decoded.jti)) {
    //   clearCookies(req, res);
    //   res.status(403).send({ success: false, message: "Token revoked" });
    //   return;
    // }
    const status = verifyToken(accessToken);
    if (status === -1) {
      res.status(403).send({ success: false, message: "Invalid token" });
      return;
    }
    if (status === 0) {
      const newAccessToken = await resetToken(req, res);
      if (!newAccessToken) {
        res.status(502).json({ success: false, message: "No new access token generated" });
        return;
      } else passToken(req, next, newAccessToken);
    } else passToken(req, next, accessToken);
  } else if (refreshToken) {
    // const decoded = decodeToken(refreshToken);
    // if (!decoded.jti) {
    //   res.status(403).send({ success: false, message: "Invalid token" });
    //   return;
    // }
    // if (await isTokenRevoked(decoded.jti)) {
    //   clearCookies(req, res);
    //   res.status(403).send({ success: false, message: "Token revoked" });
    //   return;
    // }
    const newAccessToken = await resetToken(req, res);
    if (!newAccessToken) {
      res.status(502).json({ success: false, message: "No new access token generated" });
      return;
    } else passToken(req, next, newAccessToken);
  } else {
    // Trường hợp không có accessToken và refreshToken
    res.status(401).json({ success: false, message: "Authentication required!" });
    return;
  }
};

// const clearCookies = (req: Request, res: Response): void => {
//   req.session.destroy(() => {
//     res.clearCookie("accessToken");
//     res.clearCookie("refreshToken");
//     res.clearCookie("connect.sid", { path: "/" });
//   });
// };

export const signOut = (req: Request, res: Response, next: NextFunction): void => {
  req.session.destroy(async (err: any) => {
    if (err) {
      errorHandler(err, res);
    }

    const accessToken = (await req.cookies["accessToken"]) || getTokenFromHeaders(req);
    // console.log("token", accessToken);

    if (!accessToken) {
      res.clearCookie("refreshToken");
      res.clearCookie("connect.sid", { path: "/" });
      res.status(200).send({ success: true, message: "Logged out successfully" });
      return;
    }

    try {
      // Xác thực token, bỏ qua expiration
      const decoded = jwt.verify(accessToken, process.env.SECRET_KEY as string, {
        ignoreExpiration: true,
      }) as jwt.JwtPayload;

      // console.log("Decoded token: ", decoded);

      // If the token is valid, add it to the blacklist
      const jti = decoded.jti;
      const exp = decoded.exp;

      if (jti && exp) {
        await addToBlacklist(jti, exp);
      }
    } catch (err) {
      // Still add the token to the blacklist if it's expired
      // for prevent using logged out refresh token to get new access token
      // because the refresh token is still valid until it expires
      if (err instanceof jwt.TokenExpiredError) {
        try {
          const decoded = jwt.decode(accessToken) as jwt.JwtPayload;

          const jti = decoded?.jti;
          const exp = decoded?.exp;

          if (jti && exp) {
            await addToBlacklist(jti, exp);
          }
        } catch (decodeError) {
          console.log("Failed to decode expired token:", decodeError);
        }
      } else {
        console.log("Failed to verify token:", err);
      }
    }

    // Xóa cookie bất kể token hợp lệ hay không
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.clearCookie("connect.sid", { path: "/" });
    res.status(200).send({ success: true, message: "Logged out successfully" });
  });
};

export const generateNewAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = (await req.cookies["refreshToken"]) || req.headers["x-refresh-token"];
    if (!refreshToken) {
      res.status(401).send({ message: "No refresh token provided" });
      return;
    }

    const status = verifyToken(refreshToken);

    if (status === -1) {
      res.status(403).send({ success: false, message: "Invalid token" });
      return;
    }
    if (status === 0) {
      res.status(403).send({ success: false, message: "Token expired" });
      return;
    }
    const newAccessToken = await authService.getNewAccessToken(refreshToken);
    setCookies(res, newAccessToken, refreshToken);
    res.status(201).send({ accessToken: newAccessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

const passToken = (req: Request, next: NextFunction, token: string) => {
  const payload = decodeToken(token);
  req.body.user = payload;
  next();
};

const resetToken = async (req: Request, res: Response) => {
  const refreshToken = (await req.cookies["refreshToken"]) || req.headers["x-refresh-token"];
  if (!refreshToken) {
    res.status(401).send({ message: "No refresh token provided" });
    return;
  }

  try {
    const newAccessToken = await authService.getNewAccessToken(refreshToken);
    setCookies(res, newAccessToken, refreshToken);
    return newAccessToken;
  } catch (error) {
    errorHandler(error, res);
  }
};

// Hàm thêm token vào danh sách đen
async function addToBlacklist(jti: string, exp: number): Promise<void> {
  const ttl = exp - Math.floor(Date.now() / 1000); // Thời gian sống còn lại
  if (ttl > 0) {
    await saveToCache(jti, ttl, { revoked: true });
  }
}

// Kiểm tra xem token có bị thu hồi không
async function isTokenRevoked(jti: string): Promise<boolean> {
  try {
    // console.log("Checking Redis for token: ", jti);
    const result = await getCache(jti);
    // console.log("Result from Redis: ", result);
    return result ? true : false;
  } catch (error) {
    // console.log("Error fetching from Redis: ", error);
    return false;
  }
}
