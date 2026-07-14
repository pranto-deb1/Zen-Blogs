import { Request, Response } from "express";
import { CatchAsync } from "../../utility/catchAsync/catchAsync";
import { CommentService } from "./comment.service";
import { ReturnSuccessResponse } from "../../utility/responseHelpers/response";

// get all comments
const getAllComments = CatchAsync(async (req: Request, res: Response) => {
  // call comment service to get all comments
  const result = await CommentService.getAllComments();

  // return response
  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully fetched comments", result));
});

// create single comment
const createSingleComment = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  // call comment service to create comment
  const result = await CommentService.createSingleComment(
    req.body,
    user?.id as string,
  );

  // return response
  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully created comment", result));
});

// get all comments from a single author
const getCommentByAuthorId = CatchAsync(async (req: Request, res: Response) => {
  // get id from params
  const id = req.params.id;

  // call comment serivice to get comments
  const result = await CommentService.getCommentsBuyAuthorId(id as string);

  // return response
  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully fetched comments", result));
});

// update single comment
const updateSingleComment = CatchAsync(async (req: Request, res: Response) => {
  // get user and comment id
  const user = req.user;
  const commentId = req.params.id;

  // call comment service to update comment
  const result = await CommentService.updateSingleComment(
    req.body,
    commentId as string,
    user?.id as string,
    user?.role as string,
  );

  // return the response
  res
    .status(200)
    .json(ReturnSuccessResponse("successfully updated comment", result));
});

// delete single comment
const deleteSingleComment = CatchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const commentId = req.params.id as string;

  // call comment service to delete the comment
  await CommentService.deleteSingleComment(
    commentId,
    user?.id as string,
    user?.role as string,
  );

  // return response
  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully deleted the comment"));
});

// get single comment by id
const getSingleComment = CatchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CommentService.getSingleComment(id as string);

  res
    .status(200)
    .json(ReturnSuccessResponse("successfully fetched comment", result));
});

// moderate comment
const moderateComment = CatchAsync(async (req: Request, res: Response) => {
  const commentId = req.params.id as string;

  // call comment service to update comment status
  const result = await CommentService.moderateComment(req.body, commentId);

  // return response
  res
    .status(200)
    .json(ReturnSuccessResponse("successfully updated comment", result));
});

// export comments contorller
export const CommentsController = {
  getAllComments,
  createSingleComment,
  getCommentByAuthorId,
  updateSingleComment,
  deleteSingleComment,
  getSingleComment,
  moderateComment,
};
