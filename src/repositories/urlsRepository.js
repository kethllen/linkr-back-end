import connection from "../database/database.js";

async function createUser(name, email, password, image) {
  return connection.query(
    `
    INSERT INTO 
      users(name, email, password, image)
    VALUES ($1, $2, $3, $4)
  `,
    [name, email, password, image]
  );
}
async function createSession(token, userId) {
  return connection.query(
    'INSERT INTO sessions (token, "userId") VALUES ($1, $2)',
    [token, userId]
  );
}
async function updateSession(token, userId) {
  return connection.query('UPDATE sessions SET token=$1 WHERE "userId" = $2', [
    token,
    userId,
  ]);
}
async function checkUserSession(userId) {
  return connection.query(
    `
    SELECT * FROM sessions 
      WHERE "userId" = $1
  `,
    [userId]
  );
}
export { createUser, checkUserSession, createSession, updateSession };
