import { Router } from "express";
import { AuthController } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.loginUser);
router.put(
  "/update-profile",
  auth([Role.USER, Role.ADMIN, Role.AUTHOR]),
  AuthController.updateUser,
);

export const AuthRoute = router;
