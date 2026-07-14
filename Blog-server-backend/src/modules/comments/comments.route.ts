import { Router } from "express";
import { CommentsController } from "./comments.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// get all comments (admin only)
router.get("/", auth([Role.ADMIN]), CommentsController.getAllComments);

// get comment by comment id
router.get("/:id", CommentsController.getSingleComment);

// create a comment
router.post(
  "/",
  auth([Role.ADMIN, Role.AUTHOR, Role.USER]),
  CommentsController.createSingleComment,
);

// get comment by author id
router.get("/author/:id", CommentsController.getCommentByAuthorId);

router.patch(
  "/update/:id",
  auth([Role.ADMIN, Role.AUTHOR, Role.USER]),
  CommentsController.updateSingleComment,
);

// delete single comment
router.delete(
  "/delete/:id",
  auth([Role.ADMIN, Role.AUTHOR, Role.USER]),
  CommentsController.deleteSingleComment,
);

// moderate comment
router.patch(
  "/:id/moderate",
  auth([Role.ADMIN]),
  CommentsController.moderateComment,
);

export const CommentRoute = router;
