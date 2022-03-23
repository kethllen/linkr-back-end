import { Router } from "express";
import { getPosts, publishPost } from "../controllers/postController.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";
import validSchema from "../middlewares/validSchema.js";
import postSchema from "../schemas/postSchema.js";

const postRouter = Router();
postRouter.post('/posts', validSchema(postSchema), validaTokenMiddleware, publishPost);
postRouter.get('/posts', getPosts);

export default postRouter;