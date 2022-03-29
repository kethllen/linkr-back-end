import connection from "../database/database.js";

async function selectComments(id) {
  return connection.query(
    `
        SELECT * 
        FROM comments
        WHERE "postId"=$1
    `,
    [id]
  );
}

async function insertComments(userId, postId, comment) {
  return connection.query(
    `
        INSERT INTO comments ("userId", "postId", comment)
        VALUES ($1, $2, $3)
    `,
    [userId, postId, comment]
  );
}

export { selectComments, insertComments };
