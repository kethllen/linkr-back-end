import connection from "../database/database.js";

async function selectUsers() {
  return await connection.query(
    `
      SELECT * FROM users
      `
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

async function selectPostsById(userId, id) {
  return await connection.query(
    `
        SELECT
            posts.id,
            posts.text,
            posts."userId" as "userId",
            users.name,
            users.image,
            links.url,
            links.title,
            links.description,
            links.image as "linkImage",
            COUNT(likes."userId") AS "likeQuantity",
            COUNT(comments."userId") AS "commentQuantity",
            bool_and(CASE WHEN likes."userId"=$1 THEN true ELSE null END) AS "isLiked",
            (ARRAY_AGG(u."name"))[1:2] AS "userLiked"

        FROM posts
        JOIN users ON users.id=posts."userId"
        JOIN links ON links.id=posts."linkId"
        LEFT JOIN likes ON posts.id=likes."postId"
        LEFT JOIN comments ON posts.id=comments."postId"
        LEFT JOIN users as u ON likes."userId"=u.id

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
        LIMIT 20
      `,
    [userId, id]
  );
}

export { selectUserById, selectPostsById, selectSingleUser, selectUsers };
