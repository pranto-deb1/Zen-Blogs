import { Router } from "express";
import { SubscriptionController } from "./subscription.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/checkout",
  auth([Role.ADMIN, Role.AUTHOR, Role.USER]),
  SubscriptionController.createCheckoutSession,
);

router.post("/webhook", SubscriptionController.handleWebHook);

router.get(
  "/status",
  auth([Role.ADMIN, Role.AUTHOR, Role.USER]),
  SubscriptionController.getSubscriptionStatus,
);

export const SubscriptionRoute = router;
