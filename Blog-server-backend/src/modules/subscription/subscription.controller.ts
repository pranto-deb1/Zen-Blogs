import { Request, Response } from "express";
import { CatchAsync } from "../../utility/catchAsync/catchAsync";
import { SubscriptionService } from "./subscription.service";
import { ReturnSuccessResponse } from "../../utility/responseHelpers/response";

const createCheckoutSession = CatchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await SubscriptionService.createCheckoutSession(
      userId as string,
    );

    res
      .status(200)
      .json(ReturnSuccessResponse("Checkout completed successfully", result));
  },
);

const handleWebHook = CatchAsync(async (req: Request, res: Response) => {
  const event = req.body as Buffer;
  const signature = req.headers["stripe-signature"]! as string;
  const result = await SubscriptionService.handleWebhook(event, signature);

  res.status(200).json(ReturnSuccessResponse("Webhook triggered successfully"));
});

const getSubscriptionStatus = CatchAsync(
  async (req: Request, res: Response) => {
    const result = await SubscriptionService.getSubscriptionStatus(
      req.user?.id as string,
    );

    res
      .status(200)
      .json(ReturnSuccessResponse("Successfully retrived status", result));
  },
);

export const SubscriptionController = {
  createCheckoutSession,
  handleWebHook,
  getSubscriptionStatus,
};
