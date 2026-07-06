export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export interface AppError {
  message: string;
  status: number;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IUpdateUser {
  name?: string;
  email?: string;
  bio?: string;
  profilePhoto?: string;
}
