import connection from "../database/database.js";

async function selectComments(postId, userId) {
  return connection.query(
    `
    SELECT
          comments."comment",
          comments."userId" as "idUserComment",
          users.name as "nameUserComment",
          users.image,
          bool_and(CASE WHEN followers."userId"=$1 THEN true ELSE null END) AS "isFollowing",
          bool_and(CASE WHEN posts."userId"=comments."userId" THEN true ELSE null END) AS "isAuthor"

      FROM comments
      JOIN users ON comments."userId"=users.id
      LEFT JOIN followers ON users.id=followers."followingId"
      LEFT JOIN posts ON posts.id=comments."postId"

      WHERE comments."postId"=$2
      GROUP BY
          comments.id,
          users.name,
          users.image`,
    [userId, postId]
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
