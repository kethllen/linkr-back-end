import {
  selectComments,
  insertComments,
} from "../repositories/commentsRepository.js";

export async function getComments(req, res) {
  try {
    const { user } = res.locals;
    const { postId } = req.params;
    const comments = await selectComments(Number(postId), user.id);
    console.log(comments.rows);
    return res.status(200).send(comments.rows);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function createComments(req, res) {
  try {
    const { user } = res.locals;
    const { postId, comment } = req.body;
    console.log(user.id, postId, comment);
    await insertComments(user.id, postId, comment);

    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}
