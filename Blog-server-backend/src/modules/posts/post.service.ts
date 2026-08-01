import { title } from "node:process";
import {
  CommentStatus,
  PostStatus,
  SubscriptionStatus,
} from "../../../generated/prisma/enums";
import {
  ICreatePost,
  IPostQuery,
  IUpdateSinglePost,
} from "../../interfaces/posts.interfaces";
import { prisma } from "../../lib/prisma";
import { CreateErrorRes } from "../../utility/errorHelpers/errorHelpers";
import { PostWhereInput } from "../../../generated/prisma/models";

// create single post
const insertPost = async (payload: ICreatePost, authorId: string) => {
  // check if payload exists
  if (!payload) {
    throw CreateErrorRes("request body is required", 400);
  }

  const {
    title,
    content,
    thumbnail = "https://t3.ftcdn.net/jpg/02/68/55/60/360_F_268556012_c1WBaKFN5rjRxR2eyV33znK4qnYeKZjm.jpg",
    status,
    tags,
    isPremium = false,
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

  // check if author id exists
  if (!authorId) {
    throw CreateErrorRes("You are not logged in", 400);
  }

  //   check if user exists
  const searchUser = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
    include: {
      subscription: true,
    },
  });

  if (!searchUser) {
    throw CreateErrorRes("Author not found", 404);
  }

  // check if the author is eligible to create premium content
  if (isPremium === true) {
    if (
      !searchUser.subscription ||
      searchUser.subscription?.status !== SubscriptionStatus.ACTIVE
    ) {
      throw CreateErrorRes(
        "sorry but you have to subscribe to create primum content",
        403,
      );
    }
  }

  const insertTags = tags.map((tag) => tag.toLowerCase());

  // creating post and returning post with user
  const createdPost = await prisma.post.create({
    data: {
      authorId: searchUser.id,
      title,
      content,
      thumbnail,
      status,
      tags: insertTags,
      isPremium,
    },
    include: {
      user: {
        omit: { password: true },
      },
    },
  });

  return createdPost;
};

// get all posts
const getAllPost = async (query: IPostQuery) => {
  // destructacture all queries
  const {
    limit = 10,
    page = 1,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  // declare page skip system
  const pageSkip = Number(limit) * (Number(page) - 1);

  // declare "search term" and "and conditions"
  let lowerSearch;
  const andConditions: PostWhereInput[] = [];

  // add search condition
  if (search) {
    // convert search term to lowercase for better search
    lowerSearch = search.toLowerCase();
    andConditions.push({
      OR: [
        { title: { contains: lowerSearch, mode: "insensitive" } },
        { content: { contains: lowerSearch, mode: "insensitive" } },
        {
          user: {
            name: { contains: lowerSearch, mode: "insensitive" },
          },
        },
        { tags: { has: lowerSearch } },
      ],
    });
  }

  // add title filter
  if (query.title) {
    andConditions.push({
      title: query.title,
    });
  }

  // add content filter
  if (query.content) {
    andConditions.push({
      content: query.content,
    });
  }

  // add is featured filter
  if (query.isFeatured) {
    andConditions.push({
      isFeatured: Boolean(query.isFeatured),
    });
  }

  if (query.tags) {
    andConditions.push({
      tags: { hasSome: JSON.parse(query.tags as string) },
    });
  }

  // get all post from db with filter pagination, search and filter
  const posts = await prisma.post.findMany({
    where: {
      AND: andConditions,
      isPremium: false,
    },
    skip: pageSkip,
    take: Number(limit),
    orderBy: { [sortBy]: sortOrder },
    include: { user: { omit: { password: true } }, comment: true },
  });

  // check if there are any posts
  if (posts.length === 0) {
    throw CreateErrorRes("No data found", 404);
  }

  // returning all posts
  return {
    data: { posts },
    meta: {
      page: Number(page),
      limit: Number(limit),
      total: posts.length,
      pages: Math.ceil(posts.length / Number(limit)),
    },
  };
};

// get single post by id
const getSinglePost = async (postId: string, userId: string) => {
  // check if post exists
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
      isPremium: false,
    },
  });

  // check if post exists
  if (!post) {
    throw CreateErrorRes("Post not found", 404);
  }

  // if the post is premium, check if the user has an active subscription
  if (post.isPremium) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
      throw CreateErrorRes("You need to subscribe to view this post", 403);
    }
  }

  // update and return post along user and comments
  const updatePost = await prisma.post.update({
    where: { id: postId, isPremium: false },
    data: {
      views: { increment: 1 },
    },
    include: {
      user: { omit: { password: true } },
      comment: {
        where: { status: CommentStatus.APROVED },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!updatePost) {
    throw CreateErrorRes("Faild to update post", 500);
  }

  return updatePost;
};

// get post stats
const getPostStats = async () => {
  const transactionStats = await prisma.$transaction(async (tx) => {
    const [
      totalPosts,
      getArchivedPosts,
      getDraftPosts,
      getPublishedPosts,
      totalComments,
      approvedComments,
      rejectedComments,
      postViewCounts,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),

      await tx.comment.count(),

      await tx.comment.count({
        where: { status: CommentStatus.APROVED },
      }),

      await tx.comment.count({
        where: { status: CommentStatus.REJECTED },
      }),

      await tx.post.aggregate({
        _sum: { views: true },
      }),
    ]);

    // const postViewCounts = postViewCountAgrigate._sum.views;

    return {
      totalPosts,
      getArchivedPosts,
      getDraftPosts,
      getPublishedPosts,
      totalComments,
      approvedComments,
      rejectedComments,
      postViewCounts: postViewCounts._sum.views,
    };
  });

  return transactionStats;
};

// get my post
const getMyPost = async (userId: string) => {
  // find all post by user id and include user and comments
  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: { omit: { password: true } },
      comment: true,
      _count: { select: { comment: true } },
    },
  });

  // check if user has any post
  if (!posts || posts.length === 0) {
    throw CreateErrorRes("You didn't create any post yet", 404);
  }
  return posts;
};

// delete single post
const deleteSinglePost = async (
  userId: string,
  postId: string,
  role: string,
) => {
  // check if post exists
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw CreateErrorRes("Could not find post", 404);
  }

  // check if the user is the author of the post or is he/she the admin
  if (post.authorId !== userId && role !== "ADMIN") {
    throw CreateErrorRes("You can only delete your post", 403);
  }

  // delete data
  await prisma.post.delete({ where: { id: postId } });
};

// update single post
const updateSinglePost = async (
  postId: string,
  userId: string,
  userRole: string,
  payload: IUpdateSinglePost,
) => {
  // check if payload exists
  if (!payload) {
    throw CreateErrorRes("request body is required", 400);
  }
  // check if post exists
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw CreateErrorRes("Post not found", 404);
  }

  // check if the current user is the author of the post or he/she is the admin
  if (post.authorId !== userId && userRole !== "ADMIN") {
    throw CreateErrorRes("You don't have permission to update this post", 401);
  }

  if (post.isPremium) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (subscription) {
    }
  }

  // manage the payload data
  const { title, content, thumbnail, status, tags } = payload;

  const updateData: IUpdateSinglePost = {
    ...(title && { title }),
    ...(content && { content }),
    ...(thumbnail && { thumbnail }),
    ...(status && { status }),
    ...(tags && tags.length > 0 && { tags }),
  };

  // update and return post
  const updatePost = await prisma.post.update({
    where: { id: postId },
    data: updateData,
    include: { user: { omit: { password: true } }, comment: true },
  });

  return updatePost;
};

// export post service
export const PostService = {
  insertPost,
  getAllPost,
  getSinglePost,
  getMyPost,
  deleteSinglePost,
  updateSinglePost,
  getPostStats,
};
