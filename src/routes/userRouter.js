import { Router } from "express";
import {
  getSingleUser,
  getUsers,
  getPostsById,
  getUserById,
} from "../controllers/userController.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";

const userRouter = Router();
userRouter.get("/users", validaTokenMiddleware, getUsers);
userRouter.get("/user", validaTokenMiddleware, getSingleUser);
userRouter.get("/user/:id", validaTokenMiddleware, getUserById);
userRouter.get("/users/:id", validaTokenMiddleware, getPostsById);

export default userRouter;
