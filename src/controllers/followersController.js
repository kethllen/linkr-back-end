import { verifyFollower, getTableFollowers, insertIntoFollowers, removeFromFollowers } from "../repositories/followersRepository.js";

async function getFollowers(req,res){
    try {
        const {rows: response} = await getTableFollowers();
        res.status(200).send(response)

    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
};

async function postFollower(req,res){
    const { id } = res.locals.user;   
    const {followingId} = req.body

    try {
        await insertIntoFollowers(id, followingId);    
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function getIfIsFollowing(req, res){
    const { id } = res.locals.user;
    const { visitedUserId } = req.params;

    try {
        const { rows: userIsFollowing } = verifyFollower(id, visitedUserId);
        
        res.status(200).send(userIsFollowing);
    } catch(error) {
        console.log(error)
        res.sendStatus(500);
    }
};

async function deleteFollowing(req,res){
    const { id } = res.locals.user;
    const { visitedUserId } = req.params;
    
    try {
        await removeFromFollowers(id, visitedUserId);    
        res.sendStatus(200);

    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
};

export {
    getIfIsFollowing,
    getFollowers,
    postFollower,
    deleteFollowing
};