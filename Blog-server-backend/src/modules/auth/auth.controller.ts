import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AppError } from "../../interfaces/auth.interfaces";
import {
  ReturnErrorResponse,
  ReturnSuccessResponse,
} from "../../utility/responseHelpers/response";
import { ServerError } from "../../utility/errorHelpers/errorHelpers";

const createUser = async (req: Request, res: Response) => {
  try {
    const data = await AuthService.insertUser(req.body);
    res
      .status(200)
      .json(ReturnSuccessResponse("Successfully created user", data));
  } catch (error) {
    const err = error as AppError;
    if (err.status) {
      return res.status(err.status).json(ReturnErrorResponse(err.message));
    }

    return ServerError(res, error);
  }
};

export const AuthController = {
  createUser,
};
