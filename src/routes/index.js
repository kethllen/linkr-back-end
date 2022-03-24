import { Router } from "express";
import authRouter from "./authRouter.js";
import postRouter from "./postRouter.js";
import hashtagRouter from "./hashtagRouter.js";
import userRouter from "./userRouter.js";

const router = Router();
router.use(authRouter);
router.use(postRouter);
router.use(hashtagRouter);
router.use(userRouter);

export default router;
