import { PostStatus } from "../../../generated/prisma/enums";
import { CreatePost } from "../../interfaces/posts.interfaces";
import { prisma } from "../../lib/prisma";
import { CreateErrorRes } from "../../utility/errorHelpers/errorHelpers";

const insertPost = async (payload: CreatePost, authorId: string) => {
  const {
    title,
    content,
    thumbnail = "https://t3.ftcdn.net/jpg/02/68/55/60/360_F_268556012_c1WBaKFN5rjRxR2eyV33znK4qnYeKZjm.jpg",
    isFeatured = false,
    status,
    tags,
  } = payload;

  //   check if all data exists
  if (!title || !content || !tags || !status) {
    throw CreateErrorRes("title, content, tags, status is required", 400);
  }

  // check if the status data is valid
  const validStatus = [
    PostStatus.ARCHIVED,
    PostStatus.DRAFT,
    PostStatus.PUBLISHED,
  ];
  if (!validStatus.includes(status)) {
    throw CreateErrorRes(
      "Invalid post status. status must be 'ARCHIVED', 'DRAFT' or 'PUBLISHED'",
      422,
    );
  }

  // check if the isFeatured data is valid
  if (typeof isFeatured !== "boolean") {
    throw CreateErrorRes("Invalid entry on isFeatured", 422);
  }

  // check if author id exists
  if (!authorId) {
    throw CreateErrorRes("You are not logged in", 400);
  }

  //   check if user exists
  const searchUser = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });

  if (!searchUser) {
    throw CreateErrorRes("Author not found", 404);
  }

  // creating post and returning post with user
  const createdPost = await prisma.post.create({
    data: {
      authorId: searchUser.id,
      title,
      content,
      thumbnail,
      isFeatured,
      status,
      tags,
    },
    include: {
      user: {
        omit: { password: true },
      },
    },
  });

  return createdPost;
};

const getAllPost = async () => {
  // const query: any = {};

  // if (payload.tags) query.tags = payload.tags;
  // if (payload.isFeatured) query.isFeatured = payload.isFeatured;
  // if (payload.status) query.status = payload.status;

  const posts = await prisma.post.findMany();

  if (posts.length === 0) {
    throw CreateErrorRes("No data found", 404);
  }

  return posts;
};

const getSinglePost = async (postId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw CreateErrorRes("Post not found", 404);
  }

  return post;
};

const getMyPost = async (userId: string) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
  });

  if (!posts || posts.length === 0) {
    throw CreateErrorRes("You didn't create any post yet", 404);
  }
  return posts;
};

export const PostService = {
  insertPost,
  getAllPost,
  getSinglePost,
  getMyPost,
};
