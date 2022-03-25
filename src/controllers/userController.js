import connection from "../database/database.js";

export async function getUsers(req, res) {
  try {
    const users = await connection.query(
      `
      SELECT * FROM users
      `
    );

    return res.status(200).send(users.rows);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getSingleUser(req, res) {
  try {
    const { token } = res.locals;

    const user = await connection.query(
      `
      SELECT u.id, u.name, u.image FROM users u
      JOIN sessions s
      ON s."userId" = u.id
      WHERE s.token = $1`,
      [token]
    );

    return res.status(200).send(user.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    console.log("to no by id " + id);
    const user = await connection.query(
      `
        SELECT
            *
        FROM users
        WHERE id=$1   
      `,
      [id]
    );
    console.log(user.rows[0]);
    return res.status(200).send(user.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getPostsById(req, res) {
  try {
    console.log("oi");
    const { id } = req.params;
    const posts = await connection.query(
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
            links.image as "linkImage"
        FROM posts
        JOIN users ON users.id=posts."userId"
        JOIN links ON links.id=posts."linkId"
        WHERE posts."userId"=$1
        ORDER BY id DESC
        LIMIT 20
      `,
      [id]
    );
    console.log(posts.rows);
    return res.status(200).send(posts.rows);
  } catch (error) {
    return res.sendStatus(500);
  }
}
