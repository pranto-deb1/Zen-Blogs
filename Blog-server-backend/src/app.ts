import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import cookieParser from "cookie-parser";
import { AuthRoute } from "./modules/auth/auth.route";
import { PostsRoute } from "./modules/posts/post.route";
import { UsersRoute } from "./modules/users/users.route";
import { CommentRoute } from "./modules/comments/comments.route";
import { globalError, notFound } from "./utility/errorHelpers/errorHelpers";
import { SubscriptionRoute } from "./modules/subscription/subscription.route";
import { premiumRoute } from "./modules/premium/premium.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use("/api/subscription/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", AuthRoute);
app.use("/api/posts", PostsRoute);
app.use("/api/users", UsersRoute);
app.use("/api/comments", CommentRoute);
app.use("/api/subscription", SubscriptionRoute);
app.use("/api/premium", premiumRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use(notFound);
app.use(globalError);

export default app;
