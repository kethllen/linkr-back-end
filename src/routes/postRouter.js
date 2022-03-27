import { Router } from "express";
import {
  deletePost,
  editPost,
  getPosts,
  publishPost,
  teste,
} from "../controllers/postController.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";
import validSchema from "../middlewares/validSchema.js";
import postSchema from "../schemas/postSchema.js";

const postRouter = Router();
postRouter.post(
  "/posts",
  validSchema(postSchema),
  validaTokenMiddleware,
  publishPost
);
postRouter.get("/posts", validaTokenMiddleware, getPosts);
postRouter.delete("/posts/:postId", validaTokenMiddleware, deletePost);
postRouter.put(
  "/posts/:postId",
  validSchema(postSchema),
  validaTokenMiddleware,
  editPost
);
postRouter.get("/testes", teste);

export default postRouter;
