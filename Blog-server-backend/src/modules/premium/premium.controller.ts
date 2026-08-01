import { Request, Response } from "express";
import { CatchAsync } from "../../utility/catchAsync/catchAsync";
import { ReturnSuccessResponse } from "../../utility/responseHelpers/response";
import { PremiumService } from "./premium.service";

const getPremium = CatchAsync(async (req: Request, res: Response) => {
  const result = await PremiumService.getPremium(req.query);
  res
    .status(200)
    .json(ReturnSuccessResponse("successfully fetched premium data", result));
});

export const premiumController = {
  getPremium,
};
