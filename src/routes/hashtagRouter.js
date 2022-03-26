import { Router } from "express";
import {
    getHashtags,
    postHashtags,
    getPostsWithHashtag,
} from "../controllers/hashtagController.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";

const hashtagRouter = Router();
hashtagRouter.use(validaTokenMiddleware);
hashtagRouter.post("/hashtags", postHashtags);
hashtagRouter.get("/hashtags", getHashtags);
hashtagRouter.get("/hashtag/:hashtag", getPostsWithHashtag);

export default hashtagRouter;
