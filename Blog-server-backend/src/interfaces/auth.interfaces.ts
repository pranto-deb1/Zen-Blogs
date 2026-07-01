export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export interface AppError {
  message: string;
  status: number;
}
