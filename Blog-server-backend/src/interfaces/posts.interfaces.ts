export interface CreatePost {
  title: string;
  content: string;
  thumbnail?: string;
  tags: string[];
  authorId: string;
}
