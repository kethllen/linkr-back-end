import connection from "../database/database.js";

async function selectUsers(id) {
  return await connection.query(
    `
    SELECT
    users.*,
   bool_and(CASE WHEN followers."userId"=$1 THEN true ELSE null END) AS "isFollowing"
FROM users
LEFT JOIN followers ON users.id=followers."followingId"
GROUP BY
    users.id
      `,
    [id]
  );
}

async function selectSingleUser(token) {
  return await connection.query(
    `
  SELECT u.id, u.name, u.image FROM users u
  JOIN sessions s
  ON s."userId" = u.id
  WHERE s.token = $1`,
    [token]
  );
}

async function selectUserById(id) {
  return await connection.query(
    `
        SELECT
            *
        FROM users
        WHERE id=$1   
      `,
    [id]
  );
}

async function selectPostsById(userId, id, offset) {
  return await connection.query(
    `
    SELECT
        posts.id,
        posts.text,
        posts."userId" as "userId",
        posts."repostId",
        users.name,
        users.image,
        links.url,
        links.title,
        links.description,
        links.image as "linkImage",
        COUNT(likes."userId") AS "likeQuantity",
        COUNT(comments."userId") AS "commentQuantity",
        posts."repostQuantity",
        bool_and(CASE WHEN likes."userId" = $1 THEN true ELSE null END) AS "isLiked",
        (ARRAY_AGG(u."name"))[1:2] AS "userLiked"

    FROM posts
    JOIN users ON users.id = posts."userId"
    JOIN links ON links.id = posts."linkId"
    LEFT JOIN likes ON posts.id = likes."postId"
    LEFT JOIN comments ON posts.id = comments."postId"
    LEFT JOIN users as u ON likes."userId" = u.id
    

    WHERE posts."userId"=$2

    GROUP BY
          posts.id,
          users.name,
          users.image,
          links.url,
          links.title,
          links.description,
          links.image,
          likes."postId"
    ORDER BY id DESC
    LIMIT 10
    OFFSET $3
  `,
    [userId, id, offset]
  );
}
async function selectPostsRepostsById(userId, postId) {
  return connection.query(
    `SELECT
            posts.id,
            posts.text,
            posts."userId" as "userId",
            posts."repostId",
            users.name,
            users.image,
            links.url,
            links.title,
            links.description,
            links.image as "linkImage",
            COUNT(likes."userId") AS "likeQuantity",
            COUNT(comments."userId") AS "commentQuantity",
            posts."repostQuantity",
            bool_and(CASE WHEN likes."userId" = $1 THEN true ELSE null END) AS "isLiked",
            (ARRAY_AGG(u."name"))[1:2] AS "userLiked"
            
        FROM posts
        JOIN users ON users.id = posts."userId"
        JOIN links ON links.id = posts."linkId"
        LEFT JOIN likes ON posts.id = likes."postId"
        LEFT JOIN comments ON posts.id = comments."postId"
        LEFT JOIN users as u ON likes."userId" = u.id

        WHERE posts.id=$2

        GROUP BY
              posts.id,
              users.name,
              users.image,
              links.url,
              links.title,
              links.description,
              links.image,
              likes."postId"
        ORDER BY id DESC
      `,
    [userId, postId]
  );
}
export {
  selectUserById,
  selectPostsById,
  selectSingleUser,
  selectUsers,
  selectPostsRepostsById,
};
