import { CommentStatus } from "../../../generated/prisma/enums";
import {
  ICreateComment,
  IModerateComment,
  IUpdateComment,
} from "../../interfaces/comments.interface";
import { prisma } from "../../lib/prisma";
import { CreateErrorRes } from "../../utility/errorHelpers/errorHelpers";

// get all comments
const getAllComments = async () => {
  // find comments
  const result = await prisma.comment.findMany({
    include: { post: { select: { id: true, title: true, views: true } } },
  });

  // if there is no comments return error
  if (!result || result.length === 0) {
    throw CreateErrorRes("Could not find any comment", 404);
  }

  // return comments
  return result;
};

// create single comment
const createSingleComment = async (
  payload: ICreateComment,
  authorId: string,
) => {
  if (!payload) {
    throw CreateErrorRes("content, postId is required", 400);
  }

  const { content, postId } = payload;

  // check if all data exists
  if (!content || content.length === 0 || !postId) {
    throw CreateErrorRes("content and post id is required", 400);
  }

  // check if post exists
  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    throw CreateErrorRes("Post not found", 404);
  }

  // create and return comment
  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      authorId,
    },
    include: { post: { select: { id: true, title: true, views: true } } },
  });

  return comment;
};

// get comments buy author id
const getCommentsBuyAuthorId = async (authorId: string) => {
  // check if author exists
  const author = await prisma.user.findUnique({ where: { id: authorId } });
  if (!author) {
    throw CreateErrorRes("Author not found", 404);
  }

  // find and check comments. If there is no comment return error
  const comments = await prisma.comment.findMany({
    where: { authorId, status: CommentStatus.APPROVED },
    include: { post: { select: { id: true, title: true, views: true } } },
  });

  if (!comments || comments.length === 0) {
    throw CreateErrorRes("There is no comment written by this author", 404);
  }

  // return comments
  return comments;
};

// update single comment
const updateSingleComment = async (
  payload: IUpdateComment,
  commentId: string,
  authroId: string,
  role: string,
) => {
  // check if the payload exists
  if (!payload) {
    throw CreateErrorRes("content is required", 400);
  }

  const { content } = payload;

  // check if data exists
  if (!content || content.length === 0) {
    throw CreateErrorRes("content is required", 400);
  }

  // check if comment exists
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment) {
    throw CreateErrorRes("comment not found", 404);
  }

  // check if the author exists
  const author = await prisma.user.findUnique({ where: { id: authroId } });

  if (!author) {
    throw CreateErrorRes("author not found", 404);
  }

  // check if the user has psermission to update the comment
  if (comment.authorId !== author.id && role !== "ADMIN") {
    throw CreateErrorRes(
      "you do not have permission to make changes in this comment",
      401,
    );
  }

  // update and return comment
  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      content: content,
    },
    include: { post: { select: { id: true, title: true } } },
  });

  return updatedComment;
};

// delete single comment
const deleteSingleComment = async (
  commentId: string,
  userId: string,
  role: string,
) => {
  // check if the comment exists
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment) throw CreateErrorRes("comment not found", 404);

  // check if the current user has permission to delete the comment
  if (comment.authorId !== userId && role !== "ADMIN") {
    throw CreateErrorRes(
      "you don't have permission to delete this comment",
      401,
    );
  }

  // delete comment
  await prisma.comment.delete({ where: { id: commentId } });
};

// get single comment by id
const getSingleComment = async (commentId: string) => {
  // find comment by id
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: { select: { id: true, title: true, views: true } } },
  });
  // check if the comment exists
  if (!comment) {
    throw CreateErrorRes("comment not found", 404);
  }
  // return the comment
  return comment;
};

// moderate comment
const moderateComment = async (
  payload: IModerateComment,
  commentId: string,
) => {
  // check if payload exists
  if (!payload) {
    throw CreateErrorRes("status is required", 400);
  }

  // check if the status value is valid
  const { status } = payload;

  if (status !== CommentStatus.APPROVED && status !== CommentStatus.REJECTED) {
    throw CreateErrorRes("status must be APROVED or REJECTED", 400);
  }

  // check if the comment exists
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });

  if (!comment) {
    throw CreateErrorRes("Comment not found", 404);
  }

  // update and return comment
  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      status,
    },
  });

  return updatedComment;
};

// export the comment service
export const CommentService = {
  getAllComments,
  createSingleComment,
  getCommentsBuyAuthorId,
  updateSingleComment,
  deleteSingleComment,
  getSingleComment,
  moderateComment,
};
