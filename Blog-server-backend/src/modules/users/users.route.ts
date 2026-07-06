import { Router } from "express";
import { UsersController } from "./users.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

// Augment Express Response to include `user` property

const router = Router();

router.get(
  "/me",
  auth([Role.USER, Role.AUTHOR, Role.ADMIN]),
  UsersController.getUser,
);



export const UsersRoute = router;
