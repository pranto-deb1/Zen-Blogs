import { NextFunction, Request, Response } from "express";
import { CatchAsync } from "../utility/catchAsync/catchAsync";
import { Role, SubscriptionStatus } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { CreateErrorRes } from "../utility/errorHelpers/errorHelpers";

export const premium = () => {
  return CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const role = req.user?.role;

    // check and conform that user has subscribed or is it the admin
    const subscription = await prisma.subscription.findUnique({
      where: { userId: id },
    });

    if (role !== Role.ADMIN) {
      if (!subscription) {
        throw CreateErrorRes("you are not subscribed", 403);
      }

      if (subscription.status !== SubscriptionStatus.ACTIVE) {
        throw CreateErrorRes("Pleas subscrib again to continue", 403);
      }
    }

    next();
  });
};
