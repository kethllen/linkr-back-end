import connection from "../database/database.js";

async function createUser(name, email, password) {
  return connection.query(
    `
    INSERT INTO 
      users(name, email, password)
    VALUES ($1, $2, $3)
  `,
    [name, email, password]
  );
}
export { createUser };
