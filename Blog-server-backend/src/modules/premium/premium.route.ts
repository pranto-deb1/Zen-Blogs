import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { premiumController } from "./premium.controller";
import { premium } from "../../middlewares/premium";

const router = Router();

router.get(
  "/",
  auth([Role.ADMIN, Role.USER, Role.AUTHOR]),
  premium(),
  premiumController.getPremium,
);

export const premiumRoute = router;
