import { Router } from 'express';
import { checkFollowers, getFollowers, toggleFollowingUser, verifyIfIsCurrentFollower } from "../controllers/followersController.js";
import validaTokenMiddleware from '../middlewares/validaTokenMiddleware.js';

const followersRouter = Router();
followersRouter.get("/followers", getFollowers);
followersRouter.post("/followers/:visitedUserId", validaTokenMiddleware, toggleFollowingUser);
followersRouter.get("/userfollows", validaTokenMiddleware, checkFollowers)
followersRouter.get("/followers/:visitedUserId", validaTokenMiddleware, verifyIfIsCurrentFollower);

export default followersRouter;