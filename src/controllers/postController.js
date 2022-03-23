import connection from "../database/database.js";

export async function publishPost(req, res) {
    try {
        const { user } = res.locals;
        const { text, url } = req.body;

        await connection.query(`
            INSERT INTO posts ("userId",text,url) 
            VALUES ($1,$2,$3)`
            , [user.id, text, url]);

        return res.sendStatus(201);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function getPosts(req, res) {
    try {
        const posts = await connection.query(`
            SELECT
                posts.id,
                posts.text,
                posts.url,
                users.name,
                users.image
            FROM posts
            JOIN users ON users.id=posts."userId"
            ORDER BY id DESC
            LIMIT 20
        `);

        return res.status(200).send(posts.rows);
    } catch (error) {
        return res.sendStatus(500);
    }
}