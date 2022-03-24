import { Router } from "express";
import { getUsers } from "../controllers/userController.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";

const userRouter = Router();
userRouter.get("/users", validaTokenMiddleware, getUsers);

export default userRouter;
