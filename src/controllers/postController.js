import urlMetadata from "url-metadata";
import {
    checkLinkExists,
    createLink,
    selectNewLink,
    updateLink,
    createPost,
    selectPosts,
    checkPostExists,
    updatePost,
    removePost,
    removePostFromHashtagsPosts,
    removePostFromLikes,
    removePostFromComments,
    selectPostsReposts,
    removeAllReposts
} from "../repositories/postsRepository.js";

import {
    createHashtag,
    getHashtagByName,
    connectHashtagWithPost,
} from "../repositories/hashtagsRepository.js";
import connection from "../database/database.js";

export async function publishPost(req, res) {
    try {
        const { user } = res.locals;
        const { text, link } = req.body;
        let linkId = null;

        const metadata = await urlMetadata(link, { descriptionLength: 110 });
        const { url, title, description, image } = metadata;

        const linkExists = await checkLinkExists(url);

        if (linkExists.rowCount === 0) {
            await createLink(url, title, description, image);

            const newLink = await selectNewLink(url);

            linkId = newLink.rows[0].id;
        } else {
            await updateLink(title, description, image, url);

            linkId = linkExists.rows[0].id;
        }
        await createPost(user.id, text, linkId);
        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function getPosts(req, res) {
    const { offset } = req.query;
    const { id } = res.locals.user;

    try {
        const { rows: posts } = await selectPosts(id, offset);
        let retorno = [];

        for (let post of posts) {
            if (post?.repostId !== null) {
                const { rows: originalPost } = await selectPostsReposts(
                    id,
                    post?.repostId
                ); // buscar

                const concatenar = {
                    id: post?.id,
                    name: post?.name,
                    userId: post?.userId,
                    repostId: post?.repostId,
                    idUserPost: originalPost[0]?.userId,
                    namePost: originalPost[0]?.name,
                    image: originalPost[0]?.image,
                    url: originalPost[0]?.url,
                    title: originalPost[0]?.title,
                    text: originalPost[0]?.text,
                    description: originalPost[0]?.description,
                    linkImage: originalPost[0]?.linkImage,
                    likeQuantity: originalPost[0]?.likeQuantity,
                    commentQuantity: originalPost[0]?.commentQuantity,
                    repostQuantity: originalPost[0]?.repostQuantity,
                    isLiked: originalPost[0]?.isLiked,
                    userLiked: originalPost[0]?.userLiked,
                };
                retorno.push(concatenar);
            } else {
                retorno.push(post);
            }
        }
        return res.status(200).send(retorno);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function editPost(req, res) {
    try {
        const { postId } = req.params;
        const { user } = res.locals;
        const { link, text } = req.body;

        const postExists = await checkPostExists(postId);

        if (postExists.rowCount === 0) {
            return res.sendStatus(404);
        }

        if (postExists.rows[0].userId !== user.id) {
            return res.sendStatus(401);
        }
        await removePostFromHashtagsPosts(postId);

        const hashtagsMatched = text?.match(/#[a-z0-9_]+/g);
        if (hashtagsMatched) {
            const hashtags = hashtagsMatched.map((hashtag) =>
                hashtag.replace("#", "")
            );
            hashtags.forEach(async (hashtag) => {
                let hashtagId;
                const result = await getHashtagByName(hashtag);
                if (result.rowCount !== 0) {
                    hashtagId = result.rows[0].id;
                    await connectHashtagWithPost(hashtagId, postId);
                    return;
                }
                await createHashtag(hashtag);
                const resultNewHashtag = await getHashtagByName(hashtag);
                hashtagId = resultNewHashtag.rows[0].id;
                await connectHashtagWithPost(hashtagId, postId);
            });
        }

        let linkId = null;

        const metadata = await urlMetadata(link, { descriptionLength: 110 });
        const { url, title, description, image } = metadata;

        const linkExists = await checkLinkExists(url);

        if (linkExists.rowCount === 0) {
            await createLink(url, title, description, image);

            const newLink = await selectNewLink(url);

            linkId = newLink.rows[0].id;
        } else {
            await updateLink(title, description, image, url);

            linkId = linkExists.rows[0].id;
        }

        await updatePost(text, linkId, postId);
        return res.sendStatus(200);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function deletePost(req, res) {
    try {
        const { postId } = req.params;
        const { user } = res.locals;

        const postExists = await checkPostExists(postId);

        if (postExists.rowCount === 0) {
            return res.sendStatus(404);
        }

        if (postExists.rows[0].userId !== user.id) {
            return res.sendStatus(401);
        }

        // it's an original post
        if (postExists.rows[0].repostId === null) {
            await removePostFromHashtagsPosts(postId);
            await removePostFromLikes(postId);
            await removePostFromComments(postId);
            await removeAllReposts(postId);
            await removePost(postId);

            return res.sendStatus(200);
        }

        const { repostId, repostQuantity } = postExists.rows[0]
        // console.log(repostQuantity)
        // console.log(typeof (repostQuantity))

        await connection.query(
            `
            UPDATE posts
            SET "repostQuantity"=$1
            WHERE "id"=$2
        `,
            [repostQuantity - 1, repostId]
        );

        await removePostFromHashtagsPosts(postId);
        await removePostFromLikes(postId);
        await removePostFromComments(postId);
        await removePost(postId);

        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

export async function repostPost(req, res) {
    try {
        const { postId } = req.params;
        const { user } = res.locals;

        const repostedPost = await connection.query(
            `SELECT * 
            FROM "posts"
            WHERE id=$1
        `,
            [postId]
        );

        if (repostedPost.rowCount === 0) {
            return res.sendStatus(404);
        }

        const { id, text, linkId, repostQuantity } = repostedPost.rows[0];

        await connection.query(
            `
            UPDATE posts
            SET "repostQuantity"=$1
            WHERE "id"=$2 
        `,
            [repostQuantity + 1, id]
        );

        await connection.query(
            `
            INSERT INTO posts("userId",text,"linkId","repostId","repostQuantity")
            VALUES($1,$2,$3,$4,$5)
        `,
            [user.id, text, linkId, id, repostQuantity + 1]
        );

        return res.sendStatus(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
