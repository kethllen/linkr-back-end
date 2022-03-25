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

async function getPostsWithHashtagName(hashtag) {
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
                h."name" AS "hashtagName"
            FROM posts p
            JOIN users ON users.id=p."userId"
            JOIN links ON links.id=p."linkId"
            JOIN "hashtagsPosts" hp ON hp."postId"=p.id
            JOIN hashtags h ON h.id=hp."hashtagId"
            WHERE h.name=$1
            ORDER BY id DESC
            LIMIT 20
        `,
        [hashtag]
    );
}

export { createHashtag, getHashtagsWithLimit, getPostsWithHashtagName };
