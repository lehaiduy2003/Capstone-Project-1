import { PipelineStage } from "mongoose";
import { Filter } from "../../../libs/zod/Filter";
import { Post, validatePost } from "../../../libs/zod/model/Post";
import postModel from "../Models/PostModel";
import { ObjectId } from "mongodb";
export default class PostService {
  public constructor() {}

  async createPost(postData: Post) {
    try {
      const post = new postModel(postData);
      return await post.save();
    } catch (error) {
      throw error;
    }
  }

  async getPosts(filter: Filter) {
    try {
      return await postModel
        .find()
        .sort({ [filter.sort]: filter.order })
        .skip(filter.skip)
        .limit(filter.limit)
        .lean();
    } catch (error) {
      throw error;
    }
  }

  async searchPosts(filter: Filter) {
    const order = filter.order === "asc" || filter.order === "ascending" ? 1 : -1;

    const aggregationPipeline: PipelineStage[] = [];

    // console.log(filter);

    // Add a $search stage if query name is provided
    if (filter.query) {
      aggregationPipeline.push({
        $search: {
          index: "post_title",
          text: {
            query: filter.query,
            path: "title",
            fuzzy: {
              maxEdits: 1, // Allow for some typos
            },
          },
        },
      });
    }

    aggregationPipeline.push(
      { $sort: { [filter.sort]: order } },
      { $limit: filter.limit },
      { $skip: filter.skip }
    );

    const posts: Post[] = await postModel.aggregate(aggregationPipeline);

    return posts;
  }

  async getPost(id: ObjectId) {
    try {
      return await postModel.findById(id).lean();
    } catch (error) {
      throw error;
    }
  }

  async getPostByAuthorId(authorId: ObjectId) {
    try {
      return await postModel.find({ author_id: authorId }).lean();
    } catch (error) {
      throw error;
    }
  }

  async updatePost(id: ObjectId, postData: Post) {
    try {
      return await postModel.findByIdAndUpdate(id, postData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  async deletePost(id: ObjectId) {
    try {
      const result = await postModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
