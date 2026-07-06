import { Router } from "express";
import { PostController } from "./post.controller";

const router = Router();

router.post("/create", PostController.createPost);

export const PostsRoute = router;
