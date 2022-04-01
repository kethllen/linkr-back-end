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
async function selectPostsReposts(userId, postId) {
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
async function selectPosts(userId, offset) {
    return connection.query(
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
          LEFT JOIN followers f ON posts."userId"=f."followingId"

          WHERE (f."userId"=$1 OR posts."userId"=$1)

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
          OFFSET $2
        `,
        [userId, offset]
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

async function removePostFromHashtagsPosts(postId) {
    return connection.query(
        `
          DELETE FROM "hashtagsPosts"
          WHERE "postId"=$1`,
        [postId]
    );
}

async function removePostFromLikes(postId) {
    return connection.query(
        `
          DELETE FROM likes
          WHERE "postId"=$1`,
        [postId]
    );
}

async function removePostFromComments(postId) {
    return connection.query(
        `
          DELETE FROM comments
          WHERE "postId"=$1`,
        [postId]
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

async function getPostsByUserId(id) {
    return connection.query(
        `
          SELECT p.id FROM posts p
            WHERE p."userId"=$1
            ORDER BY p.id DESC
            LIMIT 1
        `,
        [id]
    );
}

async function removeAllReposts(postId) {
    return connection.query(`
        DELETE FROM posts
        WHERE "repostId"=$1
    `, [postId]
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
    getPostsByUserId,
    removePostFromHashtagsPosts,
    removePostFromLikes,
    removePostFromComments,
    selectPostsReposts,
    removeAllReposts
};
