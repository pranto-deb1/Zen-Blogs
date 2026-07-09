export interface CreatePost {
  title: string;
  content: string;
  thumbnail?: string;
  isFeatured: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  tags: string[];
}
