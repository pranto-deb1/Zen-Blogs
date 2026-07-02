import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ReturnSuccessResponse } from "../../utility/responseHelpers/response";
import { CatchAsync } from "../../utility/catchAsync/catchAsync";

// create an user

const createUser = CatchAsync(async (req: Request, res: Response) => {
  const data = await AuthService.insertUser(req.body);
  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully created user", data));
});

// login and create profile

const loginUser = CatchAsync(async (req: Request, res: Response) => {
  const data = await AuthService.loginUser(req.body);

  res
    .status(200)
    .json(ReturnSuccessResponse("Login successfull and created profile", data));
});

export const AuthController = {
  createUser,
  loginUser,
};
