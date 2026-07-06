import { Response } from "express";
import { AppError } from "../../interfaces/auth.interfaces";
import { ReturnErrorResponse } from "../responseHelpers/response";

export const CreateErrorRes = (message: string, status: number): AppError => {
  return {
    message,
    status,
  };
};

const ServerError = <T>(res: Response, error?: T) => {
  return res.status(500).json({
    success: false,
    status: 500,
    message: "internal server error",
    error,
  });
};

export const CatchError = (error: unknown, res: Response) => {
  // check if the error is a custom error
  const err = error as AppError;
  if (err.status) {
    return res
      .status(err.status)
      .json(ReturnErrorResponse(err.message, err.status));
  }

  // return default server 500 error
  return ServerError(res, error);
};
