import connection from "../database/database.js";

export default async function validaTokenMiddleware(req, res, next) {
  
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).send("nao tenho token");
    }
    
    const session = await connection.query(
      "SELECT * FROM sessions where token=$1",
      [token]
    );

    if (session.rowCount === 0) {
      return res.status(401).send({ message: "sessao nao encontrada" });
    }

    const participant = await connection.query(
      "SELECT * FROM users where id=$1",
      [session.rows[0].userId]
    );

    if (participant.rowCount === 0) {
      return res.status(401).send({ message: "usuario nao encontrado" });
    }
        
    res.locals.user = participant.rows[0];

    res.locals.token = session.rows[0].token

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
