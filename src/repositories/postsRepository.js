import connection from "../database/database.js";

async function checkLinkExists(url) {
  return connection.query(
    `
  SELECT * 
  FROM links
  WHERE url=$1`,
    [url]
  );
}

async function createLink(url, title, description, image) {
  return connection.query(
    `
            INSERT INTO links (url, title, description, image)
            VALUES ($1, $2, $3, $4)`,
    [url, title, description, image]
  );
}

async function selectNewLink(url) {
  return connection.query(
    `
            SELECT * 
            FROM links
            WHERE url=$1`,
    [url]
  );
}

async function updateLink(title, description, image, url) {
  return connection.query(
    `
            UPDATE links 
            SET title = $1, 
                description = $2, 
                image = $3
            WHERE url=$4`,
    [title, description, image, url]
  );
}

async function createPost(userId, text, linkId) {
  return connection.query(
    `
          INSERT INTO posts ("userId",text,"linkId") 
          VALUES ($1, $2, $3)`,
    [userId, text, linkId]
  );
}

async function selectPosts() {
  return connection.query(
    `
      SELECT
          posts.id,
          posts.text,
          users.name,
          users.image,
          links.url,
          links.title,
          links.description,
          links.image as "linkImage"
      FROM posts
      JOIN users ON users.id=posts."userId"
      JOIN links ON links.id=posts."linkId"
      ORDER BY id DESC
      LIMIT 20
    `
  );
}
async function checkPostExists(postId) {
  return connection.query(
    `
          SELECT * 
          FROM posts
          WHERE id=$1`,
    [postId]
  );
}
async function updatePost(text, linkId, postId) {
  return connection.query(
    `
          UPDATE posts
          SET text=$1,
              "linkId"=$2
          WHERE id=$3`,
    [text, linkId, postId]
  );
}

async function removePost(postId) {
  return connection.query(
    `
          DELETE FROM posts
          WHERE id=$1`,
    [postId]
  );
}
export {
  checkLinkExists,
  createLink,
  selectNewLink,
  updateLink,
  createPost,
  selectPosts,
  checkPostExists,
  updatePost,
  removePost,
};
