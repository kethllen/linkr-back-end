import connection from "../database/database.js";

async function getTableFollowers() {
    return await connection.query(`
        SELECT * 
            FROM followers;
    `)
};

async function insertIntoFollowers(loggedUser, visitedUserId) {
    return await connection.query(`
        INSERT INTO followers
            ("userId", "followingId")
            VALUES ($1, $2)
    `, [loggedUser, visitedUserId]
    )
};

async function removeFromFollowers(loggedUser, visitedUserId) {
    return await connection.query(`
        DELETE FROM followers
            WHERE "userId"= $1 AND "followingId" = $2
    `, [loggedUser, visitedUserId]
    )
};

async function verifyFollower(loggedUser, visitedUserId) {
    return await connection.query(`
        SELECT *
            FROM followers f
            WHERE f."userId" = $1 
            AND f."followingId" = $2
    `, [loggedUser, visitedUserId]
    )
};

async function checkFollowersQuery(userId) {
    return await connection.query(`
        SELECT *
        FROM followers
        WHERE "userId"=$1
    `, [userId])
}

export {
    verifyFollower,
    getTableFollowers,
    insertIntoFollowers,
    removeFromFollowers,
    checkFollowersQuery
};