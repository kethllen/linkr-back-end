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
            SELECT p.*, hp."hashtagId", h."name" FROM posts p
                JOIN "hashtagsPosts" hp ON hp."postId"=p.id
                JOIN hashtags h ON h.id=hp."hashtagId"
                WHERE h.name=$1
        `,
        [hashtag]
    );
}

export { createHashtag, getHashtagsWithLimit, getPostsWithHashtagName };
