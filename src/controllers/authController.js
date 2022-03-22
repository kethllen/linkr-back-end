import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import connection from "../database/database.js";
import { createUser } from "../repositories/urlsRepository.js";

export async function signIn(req, res) {
  const { email, password } = req.body;

  const { rows: users } = await connection.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );
  const [user] = users;
  if (!user) {
    return res.sendStatus(401);
  }

  if (bcrypt.compareSync(password, user.password)) {
    const token = uuid();
    await connection.query(
      'INSERT INTO sessions (token, "userId") VALUES ($1, $2)',
      [token, user.id]
    );
    return res.send(token);
  }

  res.sendStatus(401);
}

export async function signUp(req, res) {
  const { name, email, password, image } = req.body;

  const isuser = await connection.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);

  if (isuser.rows.length !== 0) {
    return res.status(403).send({ message: "email ja cadastrado" });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  await createUser(name, email, passwordHash, image);

  res.status(201).send();
}
