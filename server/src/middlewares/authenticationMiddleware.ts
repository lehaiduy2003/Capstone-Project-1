import { NextFunction, Request, Response } from "express";
import UserProfileService from "../Modules/UserProfile/Services/UserProfileService";
import { ObjectId } from "mongodb";
import errorHandler from "./errorMiddleware";
import getUserIdFromBody from "../utils/getUserIdFromBody";

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
