import { Router } from "express";
import { getLikes, toggleLikedPost } from "../controllers/likesController.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";


const likesRouter = Router();
likesRouter.get('/likes', validaTokenMiddleware, getLikes);
likesRouter.post('/like/:postId', validaTokenMiddleware, toggleLikedPost);
export default likesRouter;