import { Router } from "express";
import { getHashtags, postHashtag } from "../controllers/hashtagController.js";
import validaTokenMiddleware from "../middlewares/validaTokenMiddleware.js";

const hashtagRouter = Router();

hashtagRouter.post("/hashtags", postHashtag);
hashtagRouter.get("/hashtags", validaTokenMiddleware, getHashtags);

export default hashtagRouter;
