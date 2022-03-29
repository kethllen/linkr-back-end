import {
  selectUserById,
  selectPostsById,
  selectSingleUser,
  selectUsers,
} from "../repositories/usersRepository.js";

export async function getUsers(req, res) {
  try {
    const users = await selectUsers();

    return res.status(200).send(users.rows);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getSingleUser(req, res) {
  try {
    const { token } = res.locals;

    const user = await selectSingleUser(token);

    return res.status(200).send(user.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = await selectUserById(id);
    return res.status(200).send(user.rows[0]);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getPostsById(req, res) {
  try {
    const { user } = res.locals;
    const { id } = req.params;

    const posts = await selectPostsById(user.id, id);
    return res.status(200).send(posts.rows);
  } catch (error) {
    return res.sendStatus(500);
  }
}
