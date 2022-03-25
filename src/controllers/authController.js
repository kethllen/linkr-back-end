import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import connection from "../database/database.js";
import {
  createUser,
  checkUserSession,
  createSession,
  updateSession,
  checkEmailExist,
} from "../repositories/urlsRepository.js";

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    console.log("oi");
    const { rows: users } = await checkEmailExist(email);
    console.log("oi de novo");
    console.log(users);
    const [user] = users;
    if (!user) {
      return res.sendStatus(401);
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      const checkUser = await checkUserSession(user.id);

      if (checkUser.rows.length > 0) {
        await updateSession(token, user.id);
      } else {
        await createSession(token, user.id);
      }
      return res.send(token);
    }

    res.sendStatus(401);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function signUp(req, res) {
  try {
    const { name, email, password, image } = req.body;

    const isuser = await checkEmailExist(email);

    if (isuser.rows.length !== 0) {
      return res.status(409).send("used email");
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await createUser(name, email, passwordHash, image);

    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
