import {
    createHashtag,
    getHashtagsWithLimit,
    getPostsWithHashtagName,
} from "../repositories/hashtagsRepository.js";

async function postHashtag(req, res) {
    const hashtag = req.body.name;
    try {
        await createHashtag(hashtag);
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

export { postHashtag, getHashtags, getPostsWithHashtag };
