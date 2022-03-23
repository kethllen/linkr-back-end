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
export { createHashtag, getHashtagsWithLimit };
