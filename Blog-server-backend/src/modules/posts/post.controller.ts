import { Request, Response } from "express";
import { PostService } from "./post.service";
import { ReturnSuccessResponse } from "../../utility/responseHelpers/response";
import { CatchAsync } from "../../utility/catchAsync/catchAsync";

// create post
const createPost = CatchAsync(async (req: Request, res: Response) => {
  // call post service to create a post
  const data = await PostService.insertPost(req.body, req.user?.id as string);
  // return success response
  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully created a post", 200, data));
});

const getAllPosts = CatchAsync(async (req: Request, res: Response) => {
  const data = await PostService.getAllPost();

  res
    .status(200)
    .json(ReturnSuccessResponse("successfully fetched data", 200, data));
});

// get post of the loged in user
const getMyPost = CatchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.id as string;
  // console.log(authorId);
  const data = await PostService.getMyPost(authorId);

  res
    .status(200)
    .json(ReturnSuccessResponse("Post retreved successfully", 200, data));
});

// get single post by post id
const getSinglePost = CatchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id as string;
  const data = await PostService.getSinglePost(postId);

  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully retreved post", 200, data));
});

export const PostController = {
  createPost,
  getAllPosts,
  getSinglePost,
  getMyPost,
};
