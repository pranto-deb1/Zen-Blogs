import { Response } from "express";
import { AppError } from "../../interfaces/auth.interfaces";

export const CreateErrorRes = (message: string, status: number): AppError => {
  return {
    message,
    status,
  };
};

export const ServerError = <T>(res: Response, error?: T) => {
  return res.status(500).json({
    success: false,
    message: "internal server error",
    error
  });
};
