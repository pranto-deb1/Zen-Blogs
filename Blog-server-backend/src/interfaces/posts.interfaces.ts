export interface ICreatePost {
  title: string;
  content: string;
  thumbnail?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  tags: string[];
}

export interface IUpdateSinglePost {
  title?: string;
  content?: string;
  thumbnail?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  tags?: string[];
}
