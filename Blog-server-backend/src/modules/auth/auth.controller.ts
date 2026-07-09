import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import {
  ReturnErrorResponse,
  ReturnSuccessResponse,
} from "../../utility/responseHelpers/response";
import { CatchAsync } from "../../utility/catchAsync/catchAsync";

// create an user

const createUser = CatchAsync(async (req: Request, res: Response) => {
  // calling the service to insert user
  const data = await AuthService.insertUser(req.body);
  // sending the response
  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully created user", 200, data));
});

// login and create profile

const loginUser = CatchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken } = await AuthService.loginUser(req.body);

  // set access and refresh token in cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  // sending the response
  res.status(200).json(
    ReturnSuccessResponse("Login successfull and created profile", 200, {
      accessToken,
      refreshToken,
    }),
  );
});

// update user and profile
const updateUser = CatchAsync(async (req: Request, res: Response) => {
  // check if request body is empty
  if (!req.body) {
    return res
      .status(400)
      .json(ReturnErrorResponse("Request body is required", 400));
  }
  // get user id from request object and call the service to update user and profile
  const userId = req.user?.id as string;
  const data = await AuthService.updateProfile(req.body, userId);

  // return the response
  res
    .status(200)
    .json(ReturnSuccessResponse("Successfully updated user", 200, data));
});

// refresh token
const refreshToken = CatchAsync(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  // call auth service to generate token
  const accessToken = await AuthService.refreshToken(token);

  // set the to cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  });

  // send response
  res.status(200).json(
    ReturnSuccessResponse("Successfully refreshed token", 200, {
      accessToken,
    }),
  );
});

// exporting the controller functions
export const AuthController = {
  createUser,
  loginUser,
  updateUser,
  refreshToken,
};
