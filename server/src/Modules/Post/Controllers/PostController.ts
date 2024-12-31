import { Request, Response } from "express";
import PostService from "../Services/PostService";
import { validatePost } from "../../../libs/zod/model/Post";
import BaseController from "../../../Base/BaseController";
import { validateFilter } from "../../../libs/zod/Filter";
import { ObjectId } from "mongodb";
import saveToCache from "../../../libs/redis/cacheSaving";
export default class PostController extends BaseController {
  private readonly postService: PostService;
  public constructor(postService: PostService) {
    super();
    this.postService = postService;
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const post = validatePost(req.body);
      const result = await this.postService.createPost(post);
      if (!result) {
        res.status(502).send({ success: false, message: "Cannot create post" });
      } else res.status(200).send({ success: true, data: result });
    } catch (error) {
      this.error(error, res);
    }
  }

  async getPosts(req: Request, res: Response): Promise<void> {
    try {
      const filter = validateFilter(req.query);
      const posts = await this.postService.getPosts(filter);
      if (!posts || posts.length === 0) {
        res.status(404).send({ success: false, message: "No posts found" });
        return;
      }
      res.status(200).send({ success: true, data: posts });
    } catch (error) {
      this.error(error, res);
    }
  }

  async getPost(req: Request, res: Response): Promise<void> {
    if (!this.checkReqParams(req, res)) return;
    try {
      const id = new ObjectId(String(req.params.id));
      const post = await this.postService.getPost(id);
      if (!post) {
        res.status(404).send({ success: false, message: "No post found" });
        return;
      }
      res.status(200).send({ success: true, data: post });
    } catch (error) {
      this.error(error, res);
    }
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    if (!this.checkReqBody(req, res) || !this.checkReqParams(req, res)) return;
    try {
      const id = new ObjectId(String(req.params.id));
      const post = validatePost(req.body);
      const updatedPost = await this.postService.updatePost(id, post);
      if (!updatedPost) {
        res.status(502).send({ success: false, message: "Cannot update post" });
      } else res.status(200).send({ success: true, data: updatedPost });
    } catch (error) {
      this.error(error, res);
    }
  }

  async searchPost(req: Request, res: Response): Promise<void> {
    try {
      const filter = validateFilter(req.query);

      const posts = await this.postService.searchPosts(filter);
      if (!posts || posts.length === 0) {
        res.status(404).send({ success: false, message: "No posts found" });
        return;
      }
      // await saveToCache(req.body.cacheKey, 300, posts); // save to cache for 300 seconds

      res.status(200).send(posts);
    } catch (error) {
      this.error(error, res);
    }
  }

  async getPostByAuthorId(req: Request, res: Response): Promise<void> {
    if (!this.checkReqParams(req, res)) return;
    try {
      const authorId = new ObjectId(String(req.params.id));
      const posts = await this.postService.getPostByAuthorId(authorId);
      if (!posts || posts.length === 0) {
        res.status(404).send({ success: false, message: "No posts found" });
        return;
      }
      res.status(200).send({ success: true, data: posts });
    } catch (error) {
      this.error(error, res);
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    if (!this.checkReqParams(req, res)) return;
    try {
      const id = new ObjectId(String(req.params.id));
      const result = await this.postService.deletePost(id);
      if (!result) {
        res.status(502).send({ success: false, message: "Cannot delete post" });
      } else res.status(200).send({ success: true, message: "Post deleted successfully" });
    } catch (error) {
      this.error(error, res);
    }
  }
}
