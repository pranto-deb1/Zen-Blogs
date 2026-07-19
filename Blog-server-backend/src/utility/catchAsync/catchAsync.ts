import { NextFunction, Request, RequestHandler, Response } from "express";
import { CatchError } from "../errorHelpers/errorHelpers";

export const CatchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      return CatchError(error, req, res, next);
    }
  };
};
