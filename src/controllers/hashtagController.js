import {
    createHashtag,
    getHashtagsWithLimit,
    getPostsWithHashtagName,
    getHashtagByName,
    connectHashtagWithPost,
} from "../repositories/hashtagsRepository.js";
import { getPostsByUserId } from "../repositories/postsRepository.js";

async function postHashtags(req, res) {
    const { id } = res.locals.user;
    const hashtags = req.body.hashtags;

    try {
        const postId = await getPostsByUserId(id);
        hashtags.forEach(async (hashtag) => {
            let hashtagId;
            const result = await getHashtagByName(hashtag);
            if (result.rowCount !== 0) {
                hashtagId = result.rows[0].id;
                await connectHashtagWithPost(hashtagId, postId.rows[0].id);
                return;
            }
            await createHashtag(hashtag);
            const resultNewHashtag = await getHashtagByName(hashtag);
            hashtagId = resultNewHashtag.rows[0].id;
            await connectHashtagWithPost(hashtagId, postId.rows[0].id);
        });
        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getHashtags(req, res) {
    try {
        const result = await getHashtagsWithLimit();
        return res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

async function getPostsWithHashtag(req, res) {
    const hashtag = req.params.hashtag;
    try {
        const result = await getPostsWithHashtagName(hashtag);
        return res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export { postHashtags, getHashtags, getPostsWithHashtag };
