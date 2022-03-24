import connection from "../database/database.js";

export async function signOut(req, res){
    const { token } = res.locals;
    
    try{
        await connection.query(`
            DELETE 
            FROM sessions
            WHERE token=$1`
            , [token]
        );
        return res.sendStatus(200);

    }catch (erro) {
        console.log(erro);
        res.sendStatus(500);
    }
};