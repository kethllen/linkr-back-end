import {
  verifyFollower,
  getTableFollowers,
  insertIntoFollowers,
  removeFromFollowers,
  checkFollowersQuery,
} from "../repositories/followersRepository.js";

async function getFollowers(req, res) {
  try {
    const { rows: response } = await getTableFollowers();
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function toggleFollowingUser(req, res) {
  const { id } = res.locals.user;
  const { visitedUserId } = req.params;

  try {
    const isFollowingUser = await verifyFollower(id, visitedUserId);

    if (isFollowingUser.rowCount) {
      await removeFromFollowers(id, visitedUserId);
    } else {
      await insertIntoFollowers(id, visitedUserId);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function verifyIfIsCurrentFollower(req, res) {
  const { id } = res.locals.user;
  const { visitedUserId } = req.params;
  let response = "";

  try {
    const isFollowingUser = await verifyFollower(id, visitedUserId);

    if (isFollowingUser.rowCount > 0) {
      response = "Unfollow";
    } else {
      response = "Follow";
    }

    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function checkFollowers(req, res) {
  const { id } = res.locals.user;
  try {
    const followers = await checkFollowersQuery(id);

    return res.status(200).send(followers.rows);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export {
  getFollowers,
  toggleFollowingUser,
  checkFollowers,
  verifyIfIsCurrentFollower,
};
