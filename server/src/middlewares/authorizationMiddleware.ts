import { Request, Response, NextFunction } from "express";
import { RoleType } from "../libs/zod/enums/Role";

const authorizeUser = (role: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.body.user.role;
    if (userRole && role.includes(userRole)) {
      next();
      return;
    }
    res.status(403).send({ message: "No permission to access this route" });
  };
};

export default authorizeUser;
