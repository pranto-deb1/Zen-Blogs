import { PostWhereInput } from "../../../generated/prisma/models";
import { IPostQuery } from "../../interfaces/posts.interfaces";
import { prisma } from "../../lib/prisma";
import { CreateErrorRes } from "../../utility/errorHelpers/errorHelpers";

const getPremium = async (query: IPostQuery) => {
  // destructure all the necessery querys
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
    title = "",
  } = query;

  // declare page skip function
  const pageSkip = Number(limit) * (Number(page) - 1);

  // declare "search term" and "and conditions"
  let lowerSearch;
  const andConditions: PostWhereInput[] = [];

  // add search condition
  if (search) {
    // convert search term to lowercase for better search
    lowerSearch = search.toLocaleLowerCase();

    andConditions.push({
      OR: [
        { title: { contains: lowerSearch, mode: "insensitive" } },
        { content: { contains: lowerSearch, mode: "insensitive" } },
        { tags: { hasSome: [lowerSearch] } },
        { user: { name: { contains: lowerSearch, mode: "insensitive" } } },
      ],
    });
  }

  // add title filter
  if (query.title) {
    andConditions.push({ title });
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
      isFeatured: query.isFeatured,
    });
  }

  // add tags filter
  if (query.tags) {
    andConditions.push({
      tags: { hasSome: JSON.parse(query.tags as string) },
    });
  }

  // get posts and return
  const posts = await prisma.post.findMany({
    where: { isPremium: true, AND: andConditions },
    take: Number(limit),
    skip: pageSkip,
    orderBy: { [sortBy]: sortOrder },
  });

  if (!posts || posts.length === 0) {
    throw CreateErrorRes("no post found", 404);
  }

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total: posts.length,
      pages: Math.ceil(posts.length / Number(limit)),
    },
    posts,
  };
};

export const PremiumService = {
  getPremium,
};
