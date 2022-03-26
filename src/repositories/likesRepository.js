import connection from "../database/database.js";

async function selectLikes() {
  return connection.query(
    `
        SELECT * 
        FROM likes
    `
  );
};

async function searchIfUserLiked(userId, postId) {
  return connection.query(
    `
        SELECT * 
        FROM likes
        WHERE "userId"=$1 AND "postId"=$2`,
        [userId, postId]
  );
};

async function insertLike(userId, postId) {
  return connection.query(
    `
        INSERT INTO likes 
        ("userId", "postId") 
        VALUES ($1, $2)`,
        [userId, postId]
  );
};

async function removeLike(id, postId) {
   
  return connection.query(
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
  searchIfUserLiked
};