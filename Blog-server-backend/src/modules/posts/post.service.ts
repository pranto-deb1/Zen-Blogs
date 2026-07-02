import { CreatePost } from "../../interfaces/posts.interfaces";
import { prisma } from "../../lib/prisma";
import { CreateErrorRes } from "../../utility/errorHelpers/errorHelpers";

const insertPost = async (payload: CreatePost) => {
  const {
    title,
    content,
    thumbnail = "https://t3.ftcdn.net/jpg/02/68/55/60/360_F_268556012_c1WBaKFN5rjRxR2eyV33znK4qnYeKZjm.jpg",
    tags,
    authorId,
  } = payload;

  //   check if all data exists
  if (!title || !content || !tags || !authorId) {
    throw CreateErrorRes("title, content, tags, author id is required", 401);
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

  // creating post
  const createdPost = await prisma.post.create({
    data: {
      authorId: searchUser.id,
      title,
      content,
      thumbnail,
      tags,
    },
  });

  //   returning post with user
  const post = await prisma.post.findUnique({
    where: {
      id: createdPost.id,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  return post;
};

export const PostService = {
  insertPost,
};
