import {
  insertLike,
  selectLikes,
  removeLike,
  searchIfUserLiked,
} from "../repositories/likesRepository.js";
import { checkRepostId } from "../repositories/commentsRepository.js";

export async function getLikes(req, res) {
  try {
    const likes = await selectLikes();

    return res.status(200).send(likes.rows);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function toggleLikedPost(req, res) {
  try {
    const { postId } = req.params;
    const { id } = res.locals.user;
    const isUserLiked = await searchIfUserLiked(id, postId);

    if (isUserLiked.rowCount) {
      await removeLike(id, postId);
    } else {
      await insertLike(id, postId);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
