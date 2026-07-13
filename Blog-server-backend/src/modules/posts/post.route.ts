import { Router } from "express";
import { PostController } from "./post.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
// create post
router.post(
  "/create",
  auth([Role.ADMIN, Role.AUTHOR, Role.USER]),
  PostController.createPost,
);

// get all posts
router.get("/", PostController.getAllPosts);

router.get("/post-stats", auth([Role.ADMIN]), PostController.getPostStats);

// get my posts
router.get(
  "/my-posts",
  auth([Role.USER, Role.AUTHOR, Role.ADMIN]),
  PostController.getMyPost,
);

// get single post
router.get(
  "/:id",
  auth([Role.ADMIN, Role.AUTHOR, Role.USER]),
  PostController.getSinglePost,
);

// delete single post
router.delete(
  "/:id",
  auth([Role.ADMIN, Role.AUTHOR, Role.USER]),
  PostController.deleteSinglePost,
);

// update single post
router.patch(
  "/:id",
  auth([Role.ADMIN, Role.AUTHOR, Role.USER]),
  PostController.updateSinglePost,
);

export const PostsRoute = router;
