import { Router } from "express";
import { getSingleUser, getUsers } from "../controllers/userController.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";

const userRouter = Router();
userRouter.get("/users", validaTokenMiddleware, getUsers);
userRouter.get("/user", validaTokenMiddleware, getSingleUser);

export default userRouter;
