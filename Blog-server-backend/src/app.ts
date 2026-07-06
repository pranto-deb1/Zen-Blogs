import express, { Application, Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import cookieParser from "cookie-parser";
import { AuthRoute } from "./modules/auth/auth.route";
import { PostsRoute } from "./modules/posts/post.route";
import { UsersRoute } from "./modules/users/users.route";
const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", AuthRoute);
app.use("/api/posts", PostsRoute);
app.use("/api/users", UsersRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

export default app;
