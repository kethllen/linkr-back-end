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

export async function getSingleUser(req, res) {
  try {

    const { token } = res.locals;

    const user = await connection.query(`
      SELECT u.name, u.image FROM users u
      JOIN sessions s
      ON s."userId" = u.id
      WHERE s.token = $1`, [token]);

      console.log('aqui', user.rows[0])

    return res.status(200).send(user.rows[0]);

  } catch (error) {
    return res.sendStatus(500);
  }
}

