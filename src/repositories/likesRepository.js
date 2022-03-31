import connection from "../database/database.js";

async function selectLikes() {
  return await connection.query(
    `
        SELECT * 
          FROM likes
    `
  );
};

async function selectOnlyTwoLikes(postId) {
  return await connection.query(
    `
        SELECT 
          users.name
          FROM likes
          JOIN posts ON posts.id = likes."postId"
          JOIN users ON users.id = likes."userId"
          WHERE posts.id = $1
          LIMIT 2
    `,[postId]
  );
};

async function searchIfUserLiked(userId, postId) {
  return await connection.query(
    `
        SELECT * 
        FROM likes
        WHERE "userId"=$1 AND "postId"=$2`,
        [userId, postId]
  );
};

async function insertLike(userId, postId) {
  return await connection.query(
    `
        INSERT INTO likes 
        ("userId", "postId") 
        VALUES ($1, $2)`,
        [userId, postId]
  );
};

async function removeLike(id, postId) {
   
  return await connection.query(
    `
        DELETE FROM likes
        WHERE "userId"=$1 AND "postId"=$2`,
        [id, postId]
  );
};

export {
  selectLikes,
  insertLike,
  removeLike,
  searchIfUserLiked,
  selectOnlyTwoLikes
};