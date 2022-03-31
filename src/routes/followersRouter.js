import { Router } from 'express';
import { getFollowers, toggleFollowingUser } from "../controllers/followersController.js";
import validaTokenMiddleware from '../middlewares/validaTokenMiddleware.js';

const followersRouter = Router();
followersRouter.get("/followers", getFollowers);
followersRouter.post("/followers/:visitedUserId", validaTokenMiddleware, toggleFollowingUser);
export default followersRouter;