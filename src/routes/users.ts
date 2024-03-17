import { Router } from 'express';
import { changePassword, forgotPassword, getUser, loginUser, signUpUser, updateUser } from '../controllers/users';
import { verifyUser } from '../middlewares/auth';
import { validate } from '../utils/helper';
import {
    changeUserPasswordValidation,
    forgotPasswordValidation,
    loginUserValidation,
    signUpUserValidation,
    updateUserValidation,
} from '../validations/users';
import { getShoe, getShoes } from '../controllers/shoes';

const usersRouter = Router();

usersRouter.post('/signup', validate(signUpUserValidation), signUpUser);

usersRouter.post('/login', validate(loginUserValidation), loginUser);

usersRouter.post('/forgot-password', validate(forgotPasswordValidation), forgotPassword);

usersRouter.use(verifyUser);

usersRouter.get('/me', getUser);

usersRouter.put('/change-password', validate(changeUserPasswordValidation), changePassword);

usersRouter.put('/update', validate(updateUserValidation), updateUser);

usersRouter.get('/shoes', getShoes);

usersRouter.get('/shoes/:id', getShoe);

export default usersRouter;
