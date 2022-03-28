import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import {
  createUser,
  checkUserSession,
  createSession,
  updateSession,
  checkEmailExist,
  checkUsernameExist,
} from "../repositories/urlsRepository.js";

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    const { rows: users } = await checkEmailExist(email);
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
    const nameLower = name.toLowerCase();
    const isuser = await checkEmailExist(email);
    const isname = await checkUsernameExist(nameLower);
    if (isuser.rows.length !== 0) {
      return res.status(409).send("used email");
    }
    if (isname.rows.length !== 0) {
      return res.status(410).send("used username ");
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await createUser(name, email, passwordHash, image);

    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
