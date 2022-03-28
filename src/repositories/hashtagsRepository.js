import connection from "../database/database.js";

async function createHashtag(name) {
    return connection.query(
        `
            INSERT INTO hashtags(name)
                VALUES ($1)        
        `,
        [name]
    );
}

async function connectHashtagWithPost(hashtagId, postId) {
    return connection.query(
        `
            INSERT INTO "hashtagsPosts"("hashtagId","postId")
                VALUES ($1,$2)
        `,
        [hashtagId, postId]
    );
}

async function getHashtagByName(hashtagName) {
    return connection.query(
        `
            SELECT * FROM hashtags h
                WHERE h.name=$1
        `,
        [hashtagName]
    );
}

async function getHashtagsWithLimit() {
    return connection.query(
        `
        SELECT h.name, h.id, COUNT(hp."hashtagId") AS count FROM hashtags h
            JOIN "hashtagsPosts" hp ON hp."hashtagId"=h.id
            GROUP BY h.name,h.id
            ORDER BY count DESC
            LIMIT 10
        `
    );
}

async function getPostsWithHashtagName(postId, hashtag) {
    return connection.query(
        `
            SELECT
                p.id,
                p.text,
                p."userId" as "userId",
                users.name,
                users.image,
                links.url,
                links.title,
                links.description,
                links.image as "linkImage",
                hp."hashtagId", 
                h."name" AS "hashtagName",
                COUNT(DISTINCT likes."userId") AS "likeQuantity",
                bool_and(DISTINCT CASE WHEN likes."userId"=$1 THEN true ELSE null END) AS "isLiked",
                (ARRAY_AGG(DISTINCT u."name"))[1:2] AS "userLiked"

            FROM posts p
            JOIN users ON users.id=p."userId"
            JOIN links ON links.id=p."linkId"
            JOIN "hashtagsPosts" hp ON hp."postId"=p.id
            JOIN hashtags h ON h.id=hp."hashtagId"
            LEFT JOIN likes ON p.id=likes."postId"
            LEFT JOIN users as u ON likes."userId"=u.id

            WHERE h.name=$2
            GROUP BY 
                p.id, 
                users.name, 
                users.image, 
                links.url, 
                links.title,
                links.description,
                links.image,
                likes."postId",
                hp."hashtagId", 
                h."name"
            ORDER BY id DESC
            LIMIT 20
        `,
        [postId, hashtag]
    );
}

export {
    createHashtag,
    getHashtagsWithLimit,
    getPostsWithHashtagName,
    connectHashtagWithPost,
    getHashtagByName,
};
