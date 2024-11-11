import { NextFunction, Request, Response } from "express";
import UserProfileService from "../Modules/UserProfile/Services/UserProfileService";
import { ObjectId } from "mongodb";

/**
 * For validating the token provided by the user with the user's account id.
 * ```If the token does not belong to the user, it will return 404```
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express NextFunction
 */
const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userProfileService = new UserProfileService();
  const accountId: string = req.body.user.sub; // sub is the accountId from the token
  const userId = req.originalUrl.split("/")[2];
  // console.log("userId", userId);
  // console.log("accountId", accountId);

  try {
    const user = await userProfileService.findById(new ObjectId(userId));
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    if (user.account_id.toString() !== accountId) {
      res.status(401).send({ message: "Invalid user's token" });
      return;
    }

    req.body.id = userId;
    next();
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export default authenticateUser;
