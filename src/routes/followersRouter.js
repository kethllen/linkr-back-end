import { Router } from 'express';
import { getIfIsFollowing, getFollowers, postFollower, deleteFollowing } from "../controllers/followersController.js";
import validaTokenMiddleware from '../middlewares/validaTokenMiddleware.js';

const followersRouter = Router();
followersRouter.get("/followers", getFollowers);
followersRouter.get("/followers/:visitedUserId", validaTokenMiddleware, getIfIsFollowing);
followersRouter.post("/followers", validaTokenMiddleware, postFollower);
followersRouter.delete("/followers/:visitedUserId", validaTokenMiddleware, deleteFollowing)

export default followersRouter;