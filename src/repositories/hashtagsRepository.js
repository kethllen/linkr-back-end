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
        SELECT * FROM hashtags
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
