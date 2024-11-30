import { Request, Response, NextFunction } from "express";

enum Role {
  CUSTOMER = "customer",
  RECYCLER = "recycler",
  ADMIN = "admin",
  SHIPPER = "shipper",
}

class AuthorizeUser {
  isCustomer(req: Request, res: Response, next: NextFunction): void {
    const role = req.body.user.role;
    if (role && role === Role.CUSTOMER) {
      next();
      return;
    }
    res.status(403).send({ success: false, message: "No permission to access this route" });
  }

  isRecycler(req: Request, res: Response, next: NextFunction): void {
    const role = req.body.user.role;
    if (role && role === Role.RECYCLER) {
      next();
      return;
    }
    res.status(403).send({ message: "No permission to access this route" });
  }

  isAdmin(req: Request, res: Response, next: NextFunction): void {
    const role = req.body.user.role;
    if (role && role === Role.ADMIN) {
      next();
      return;
    }
    res.status(403).send({ message: "No permission to access this route" });
  }

  isShipper(req: Request, res: Response, next: NextFunction): void {
    const role = req.body.user.role;
    if (role && role === Role.SHIPPER) {
      next();
      return;
    }
    res.status(403).send({ message: "No permission to access this route" });
  }

  isCustomerOrRecycler(req: Request, res: Response, next: NextFunction): void {
    const role = req.body.user.role;
    // console.log("role", role);

    if (role && (role === Role.CUSTOMER || role === Role.RECYCLER)) {
      next();
      return;
    }
    res.status(403).send({ message: "No permission to access this route" });
  }
}

const authorizeUser = new AuthorizeUser();

export default authorizeUser;
