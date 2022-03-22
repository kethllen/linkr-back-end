import { Router } from 'express';
import { signIn,signUp } from '../controllers/authController.js';
import signInSchema  from '../schemas/signInSchema.js';
import userSchema  from '../schemas/userSchema.js';
import validSchema from '../middlewares/validSchema.js'


const authRouter = Router();
authRouter.post("/sign-in",validSchema(signInSchema), signIn);
authRouter.post("/sign-up",validSchema(userSchema), signUp);

export default authRouter;