import { Application, Router } from "express";

export default abstract class BaseRouter {
  protected readonly router: Router;

  protected constructor() {
    this.router = Router();
  }

  // for subclasses to implement
  public abstract initRoutes(): void;

  public getRoutes(): Router {
    return this.router;
  }

  public register(path: string, app: Application): void {
    app.use(path, this.getRoutes());
  }
}
