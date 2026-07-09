import { Router } from "express";
import { PostController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/create",
  auth([Role.ADMIN, Role.AUTHOR, Role.USER]),
  PostController.createPost,
);

router.get("/", PostController.getAllPosts);

router.get(
  "/my-posts",
  auth([Role.USER, Role.AUTHOR, Role.ADMIN]),
  PostController.getMyPost,
);

router.get(
  "/:id",
  auth([Role.ADMIN, Role.AUTHOR, Role.USER]),
  PostController.getSinglePost,
);

export const PostsRoute = router;
