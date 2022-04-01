import { Router } from 'express';
import { checkFollowers, getFollowers, toggleFollowingUser } from "../controllers/followersController.js";
import validaTokenMiddleware from '../middlewares/validaTokenMiddleware.js';

const followersRouter = Router();
followersRouter.get("/followers", getFollowers);
followersRouter.post("/followers/:visitedUserId", validaTokenMiddleware, toggleFollowingUser);
followersRouter.get("/userfollows", validaTokenMiddleware, checkFollowers)
export default followersRouter;