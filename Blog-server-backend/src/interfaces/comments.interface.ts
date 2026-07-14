export interface ICreateComment {
  content: string;
  postId: string;
}

export interface IUpdateComment {
  content: string;
}

export interface IModerateComment {
  status: string;
}
