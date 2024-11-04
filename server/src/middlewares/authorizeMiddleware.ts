import { Request, Response, NextFunction } from "express";

// for exact role (compare equal)
interface IExactAuthorize {
  compareEqualRole(req: Request, res: Response, next: NextFunction): void;
}

// for inexact role (compare less than or greater than)
interface IInExactAuthorize {
  compareInEqualRole(req: Request, res: Response, next: NextFunction): void;
}

enum Role {
  CUSTOMER = "customer",
  RECYCLER = "recycler",
  ADMIN = "admin",
}

class AuthorizeCustomer implements IInExactAuthorize {
  compareInEqualRole(req: Request, res: Response, next: NextFunction): void {
    if (req.body.user.role >= Role.CUSTOMER) {
      next();
      return;
    }
    res.status(403).send("No permission to access this route");
  }
}

class AuthorizeRecycler implements IInExactAuthorize, IExactAuthorize {
  compareEqualRole(req: Request, res: Response, next: NextFunction): void {
    if (req.body.user.role !== Role.RECYCLER) {
      res.status(403).send("No permission to access this route");
      return;
    }
    next();
  }

  compareInEqualRole(req: Request, res: Response, next: NextFunction): void {
    if (req.body.user.role < Role.RECYCLER) {
      res.status(403).send("No permission to access this route");
      return;
    }
    next();
  }
}

class AuthorizeAdmin implements IExactAuthorize {
  compareEqualRole(req: Request, res: Response, next: NextFunction): void {
    if (req.body.user.role !== Role.ADMIN) {
      res.status(403).send("No permission to access this route");
      return;
    }
    next();
  }
}

const authorizeCustomer = new AuthorizeCustomer();
const authorizeRecycler = new AuthorizeRecycler();
const authorizeAdmin = new AuthorizeAdmin();

export { authorizeCustomer, authorizeRecycler, authorizeAdmin };
