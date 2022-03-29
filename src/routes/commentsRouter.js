import { Router } from "express";
import {
  getComments,
  createComments,
} from "../controllers/commentsController.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";
import validSchema from "../middlewares/validSchema.js";
import commentSchema from "../schemas/commentSchema.js";

const commentsRouter = Router();
commentsRouter.get("/comments/:postId", validaTokenMiddleware, getComments);
commentsRouter.post(
  "/comments",
  validSchema(commentSchema),
  validaTokenMiddleware,
  createComments
);
export default commentsRouter;
