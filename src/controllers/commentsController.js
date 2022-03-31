import {
  selectComments,
  insertComments,
  checkRepostId,
} from "../repositories/commentsRepository.js";

export async function getComments(req, res) {
  try {
    const { user } = res.locals;
    const { postId } = req.params;
    const repost = await checkRepostId(Number(postId));

    if (repost.rows[0].repostId === null) {
      const comments = await selectComments(Number(postId), user.id);
      return res.status(200).send(comments.rows);
    } else {
      const comments = await selectComments(
        Number(repost.rows[0].repostId),
        user.id
      );
      return res.status(200).send(comments.rows);
    }
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function createComments(req, res) {
  try {
    const { user } = res.locals;
    const { postId, comment } = req.body;

    const repost = await checkRepostId(Number(postId));
    if (repost.rows[0].repostId === null) {
      await insertComments(user.id, postId, comment);
    } else {
      await insertComments(user.id, repost.rows[0].repostId, comment);
    }

    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}
