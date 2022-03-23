import connection from "../database/database.js";
import urlMetadata from 'url-metadata';

export async function publishPost(req, res) {
    try {
        const { user } = res.locals;
        const { text, link } = req.body;
        let linkId = null;

        const metadata = await urlMetadata(link, { descriptionLength: 110 });
        const { url, title, description, image } = metadata;

        const linkExists = await connection.query(`
            SELECT * 
            FROM links
            WHERE url=$1`
            , [url]
        );

        if (linkExists.rowCount === 0) {
            await connection.query(`
                INSERT INTO links (url, title, description, image)
                VALUES ($1, $2, $3, $4)`
                , [url, title, description, image]);

            const newLink = await connection.query(`
                SELECT * 
                FROM links
                WHERE url=$1`
                , [url]
            );

            linkId = newLink.rows[0].id;
        } else {
            await connection.query(`
                UPDATE links 
                SET title = $1, 
                    description = $2, 
                    image = $3
                WHERE url=$4`
                , [title, description, image, url]);

            linkId = linkExists.rows[0].id;
        }

        await connection.query(`
            INSERT INTO posts ("userId",text,"linkId") 
            VALUES ($1, $2, $3)`
            , [user.id, text, linkId]
        );

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
                users.name,
                users.image,
                links.url,
                links.title,
                links.description,
                links.image as "linkImage"
            FROM posts
            JOIN users ON users.id=posts."userId"
            JOIN links ON links.id=posts."linkId"
            ORDER BY id DESC
            LIMIT 20
        `);

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

        const postExists = await connection.query(`
            SELECT * 
            FROM posts
            WHERE id=$1`
            , [postId]
        );

        if (postExists.rowCount === 0) {
            return res.sendStatus(404);
        }

        if (postExists.rows[0].userId !== user.id) {
            return res.sendStatus(401);
        }

        let linkId = null;

        const metadata = await urlMetadata(link, { descriptionLength: 110 });
        const { url, title, description, image } = metadata;

        const linkExists = await connection.query(`
            SELECT * 
            FROM links
            WHERE url=$1`
            , [url]
        );

        if (linkExists.rowCount === 0) {
            await connection.query(`
                INSERT INTO links (url, title, description, image)
                VALUES ($1, $2, $3, $4)`
                , [url, title, description, image]);

            const newLink = await connection.query(`
                SELECT * 
                FROM links
                WHERE url=$1`
                , [url]
            );

            linkId = newLink.rows[0].id;
        } else {
            linkId = linkExists.rows[0].id;
        }

        await connection.query(`
            UPDATE posts
            SET text=$1,
                "linkId"=$2
            WHERE id=$3`
            , [text, linkId, postId]
        );


        return res.sendStatus(200);
    } catch (error) {
        return res.sendStatus(500);
    }
}

export async function deletePost(req, res) {
    try {
        const { postId } = req.params;
        const { user } = res.locals;

        const postExists = await connection.query(`
            SELECT * 
            FROM posts
            WHERE id=$1`
            , [postId]
        );

        if (postExists.rowCount === 0) {
            return res.sendStatus(404);
        }

        if (postExists.rows[0].userId !== user.id) {
            return res.sendStatus(401);
        }

        await connection.query(`
            DELETE FROM posts
            WHERE id=$1`
            , [postId]
        );

        return res.status(200);
    } catch (error) {
        return res.sendStatus(500);
    }

}