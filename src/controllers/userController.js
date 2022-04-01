import {
  selectUserById,
  selectPostsById,
  selectSingleUser,
  selectUsers,
  selectPostsRepostsById,
} from "../repositories/usersRepository.js";

export async function getUsers(req, res) {
  const { id } = res.locals.user;
  try {
    const users = await selectUsers(id);
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
    const { offset } = req.query;
    console.log(offset);
    let newOffset = 0;
    if (offset) {
      newOffset = offset;
    }
    const { rows: posts } = await selectPostsById(user.id, id, newOffset);
    let retorno = [];

    for (let post of posts) {
      if (post?.repostId !== null) {
        const { rows: originalPost } = await selectPostsRepostsById(
          id,
          post?.repostId
        );

        const concatenar = {
          id: post?.id,
          name: post?.name,
          userId: post?.userId,
          repostId: post?.repostId,
          idUserPost: originalPost[0]?.userId,
          namePost: originalPost[0]?.name,
          image: originalPost[0]?.image,
          url: originalPost[0]?.url,
          title: originalPost[0]?.title,
          text: originalPost[0]?.text,
          description: originalPost[0]?.description,
          linkImage: originalPost[0]?.linkImage,
          likeQuantity: originalPost[0]?.likeQuantity,
          commentQuantity: originalPost[0]?.commentQuantity,
          repostQuantity: originalPost[0]?.repostQuantity,
          isLiked: originalPost[0]?.isLiked,
          userLiked: originalPost[0]?.userLiked,
        };

        retorno.push(concatenar);
      } else {
        retorno.push(post);
      }
    }

    return res.status(200).send(retorno);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
