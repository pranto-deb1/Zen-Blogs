import { NextFunction, Request, Response } from "express";
import { AppError } from "../../interfaces/auth.interfaces";
import { ReturnErrorResponse } from "../responseHelpers/response";

export const CreateErrorRes = (message: string, status: number): AppError => {
  return {
    message,
    status,
  };
};

// const ServerError = <T>(res: Response, error?: T) => {
//   return res.status(500).json({
//     success: false,
//     status: 500,
//     message: "internal server error",
//     error,
//   });
// };

export const CatchError = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // check if the error is a custom error
  const err = error as AppError;
  if (err.status) {
    return res
      .status(err.status)
      .json(ReturnErrorResponse(err.message, err.status));
  }

  next(error);
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: "Page not found",
    path: req.originalUrl,
    date: Date(),
  });
};

export const globalError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(500).json({
    success: false,
    status: 500,
    message: err.message,
    error: err,
  });
};
