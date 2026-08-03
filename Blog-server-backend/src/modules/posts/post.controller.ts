import { Request, Response } from "express";
import { PostService } from "./post.service";
import {
  ReturnSuccessResponse,
  ReturnErrorResponse,
} from "../../utility/responseHelpers/response";
import { CatchAsync } from "../../utility/catchAsync/catchAsync";

// create post
const createPost = CatchAsync(async (req: Request, res: Response) => {
  // call post service to create a post
  const data = await PostService.insertPost(req.body, req.user?.id as string);
  // return success response
  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully created a post", data));
});

const getAllPosts = CatchAsync(async (req: Request, res: Response) => {
  const data = await PostService.getAllPost(req.query);

  res
    .status(200)
    .json(ReturnSuccessResponse("successfully fetched data", data));
});

// get single post by post id
const getSinglePost = CatchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id as string;
  if (!postId) {
    return res
      .status(400)
      .json(ReturnErrorResponse("Post Id is required", 400));
  }
  const data = await PostService.getSinglePost(postId, req.user?.id as string);

  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully retreved post", data));
});

// get post of the loged in user
const getMyPost = CatchAsync(async (req: Request, res: Response) => {
  const authorId = req.user?.id as string;
  // console.log(authorId);
  const data = await PostService.getMyPost(authorId);
  res
    .status(200)
    .json(ReturnSuccessResponse("Post retreved successfully", data));
});

// delete single post
const deleteSinglePost = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const postId = req.params.id;

  // call post service to delete post
  const result = await PostService.deleteSinglePost(
    user?.id as string,
    postId as string,
    user?.role as string,
  );

  // send response
  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully deleted post", result));
});

// update single post
const updateSinglePost = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const postId = req.params.id;

  // check if the req.body is empty
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json(ReturnErrorResponse("update data is required", 400));
  }

  // call the post service to update the post and return the response
  const result = await PostService.updateSinglePost(
    postId as string,
    user?.id as string,
    user?.role as string,
    req.body,
  );

  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully updated post", result));
});

// get all post stats
const getPostStats = CatchAsync(async (req: Request, res: Response) => {
  const data = await PostService.getPostStats();

  res
    .status(200)
    .json(ReturnSuccessResponse("successfully fetched data", data));
});

export const PostController = {
  createPost,
  getAllPosts,
  getSinglePost,
  getMyPost,
  deleteSinglePost,
  updateSinglePost,
  getPostStats,
};
