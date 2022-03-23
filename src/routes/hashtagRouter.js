import { Router } from "express";
import {
    getHashtags,
    postHashtag,
    getPostsWithHashtag,
} from "../controllers/hashtagController.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";

const hashtagRouter = Router();

hashtagRouter.post("/hashtags", postHashtag);
hashtagRouter.get("/hashtags", validaTokenMiddleware, getHashtags);
hashtagRouter.get(
    "/hashtag/:hashtag",
    validaTokenMiddleware,
    getPostsWithHashtag
);

export default hashtagRouter;
