import { Request, Response } from "express";
import { CatchAsync } from "../../utility/catchAsync/catchAsync";
import { UsersService } from "./users.service";
import { ReturnSuccessResponse } from "../../utility/responseHelpers/response";

const getUser = CatchAsync(async (req: Request, res: Response) => {
  if (!req.user || !req.user.id) {
    return res
      .status(400)
      .json({ message: "User ID is missing in the request" });
  }
  const data = await UsersService.getUser(req.user.id);


  res
    .status(200)
    .json(ReturnSuccessResponse("user fetched successfully", 200, data));
});

export const UsersController = {
  getUser,
};
