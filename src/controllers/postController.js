import connection from "../database/database.js";
import urlMetadata from "url-metadata";
import {
  checkLinkExists,
  createLink,
  selectNewLink,
  updateLink,
  createPost,
  selectPosts,
  checkPostExists,
  updatePost,
  removePost,
} from "../repositories/postsRepository.js";

export async function publishPost(req, res) {
  try {
    const { user } = res.locals;
    const { text, link } = req.body;
    let linkId = null;

    const metadata = await urlMetadata(link, { descriptionLength: 110 });
    const { url, title, description, image } = metadata;

    const linkExists = await checkLinkExists(url);

    if (linkExists.rowCount === 0) {
      await createLink(url, title, description, image);

      const newLink = await selectNewLink(url);

      linkId = newLink.rows[0].id;
    } else {
      await updateLink(title, description, image, url);

      linkId = linkExists.rows[0].id;
    }

    await createPost(user.id, text, linkId);

    return res.sendStatus(201);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function getPosts(req, res) {
  try {
    const posts = await selectPosts();

    return res.status(200).send(posts.rows);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function editPost(req, res) {
  try {
    const { postId } = req.params;
    const { user } = res.locals;
    const { link, text } = req.body;

    const postExists = await checkPostExists(postId);

    if (postExists.rowCount === 0) {
      return res.sendStatus(404);
    }

    if (postExists.rows[0].userId !== user.id) {
      return res.sendStatus(401);
    }

    let linkId = null;

    const metadata = await urlMetadata(link, { descriptionLength: 110 });
    const { url, title, description, image } = metadata;

    const linkExists = await checkLinkExists(url);

    if (linkExists.rowCount === 0) {
      await createLink(url, title, description, image);

      const newLink = selectNewLink(url);

      linkId = newLink.rows[0].id;
    } else {
      linkId = linkExists.rows[0].id;
    }

    await updatePost(text, linkId, postId);

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function deletePost(req, res) {
  try {
    const { postId } = req.params;
    const { user } = res.locals;

    const postExists = await checkPostExists(postId);

    if (postExists.rowCount === 0) {
      return res.sendStatus(404);
    }

    if (postExists.rows[0].userId !== user.id) {
      return res.sendStatus(401);
    }

    await removePost(postId);

    return res.status(200);
  } catch (error) {
    return res.sendStatus(500);
  }
}
