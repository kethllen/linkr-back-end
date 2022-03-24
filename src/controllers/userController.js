import connection from "../database/database.js";

export async function getUsers(req, res) {
  try {
    const users = await connection.query(
      `
      SELECT * FROM users;
      `
    );

    return res.status(200).send(users.rows);
  } catch (error) {
    return res.sendStatus(500);
  }
}
