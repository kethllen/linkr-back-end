import db from "../db.js";
import { ObjectId } from "mongodb";

export default async function validaTokenMiddleware(req, res, next) {
  try {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send("nao tenho token");
    }

    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      return res.status(401).send({ message: "sessao nao encontrada" });
    }

    const participant = await db
      .collection("users")
      .findOne({ _id: session.userId });
    if (!participant) {
      console.log("deu ruim no usuario");
      return res.status(401).send({ message: "usuario nao encontrado" });
    }

    res.locals.user = participant;

    next();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
