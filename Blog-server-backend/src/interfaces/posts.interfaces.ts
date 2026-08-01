import { PostWhereInput } from "../../generated/prisma/models";

export interface ICreatePost {
  title: string;
  content: string;
  thumbnail?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  tags: string[];
  isPremium?: boolean;
}

export interface IUpdateSinglePost {
  title?: string;
  content?: string;
  thumbnail?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  tags?: string[];
}

export interface IPostQuery extends PostWhereInput {
  limit?: string;
  page?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}
