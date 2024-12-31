import BaseRouter from "../../../Base/BaseRouter";
import { Role } from "../../../libs/zod/enums/Role";
import { checkTokens } from "../../../middlewares/authenticationMiddleware";
import authorizeUser from "../../../middlewares/authorizationMiddleware";
import checkCache from "../../../middlewares/cacheMiddleware";
import validateToken from "../../../middlewares/tokenMiddleware";
import PostController from "../Controllers/PostController";
import PostService from "../Services/PostService";

class PostRouter extends BaseRouter {
  private readonly postController: PostController;

  constructor(postController: PostController) {
    super();
    this.postController = postController;
    this.initRoutes();
  }

  public initRoutes(): void {
    this.router.post(
      "/",
      checkTokens,
      authorizeUser([Role.Enum.customer]),
      this.postController.createPost.bind(this.postController)
    );
    this.router.get(
      "/search",
      // checkCache,
      this.postController.searchPost.bind(this.postController)
    );
    this.router.get("/", this.postController.getPosts.bind(this.postController));
    this.router.get("/:id", this.postController.getPost.bind(this.postController));
    this.router.put(
      "/:id",
      checkTokens,
      authorizeUser([Role.Enum.customer]),
      this.postController.updatePost.bind(this.postController)
    );
    this.router.delete(
      "/:id",
      checkTokens,
      authorizeUser([Role.Enum.customer]),
      this.postController.deletePost.bind(this.postController)
    );
    this.router.get("/users/:id", this.postController.getPostByAuthorId.bind(this.postController));
  }
}

// "/posts/"
const createPostRouter = (): PostRouter => {
  const postService = new PostService();
  const postController = new PostController(postService);

  return new PostRouter(postController);
};

export default createPostRouter;
