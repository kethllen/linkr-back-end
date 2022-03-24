import { Router } from 'express';
import { signOut } from '../controllers/signOutController.js';
import validaTokenMiddleware from '../middlewares/validaTokenMiddleware.js';

const signOutRouter = Router();

signOutRouter.delete('/sign-out', validaTokenMiddleware, signOut);

export default signOutRouter;