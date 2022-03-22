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
export { createUser };
