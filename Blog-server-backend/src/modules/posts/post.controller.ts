import { Request, Response } from "express";
import { PostService } from "./post.service";
import { ReturnSuccessResponse } from "../../utility/responseHelpers/response";
import { CatchAsync } from "../../utility/catchAsync/catchAsync";

// create post
const createPost = CatchAsync(async (req: Request, res: Response) => {
  // call post service to create a post
  const data = await PostService.insertPost(req.body);
  // return success response
  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully created a post", 200, data));
});

export const PostController = {
  createPost,
};
