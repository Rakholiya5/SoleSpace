import { Router } from 'express';
import {
    changePassword,
    forgotPassword,
    getUser,
    loginUser,
    sendEmailVerificationLink,
    signUpUser,
    updateUser,
    verifyEmail,
} from '../controllers/users';
import { verifyUser } from '../middlewares/auth';
import { validate } from '../utils/helper';
import {
    changeUserPasswordValidation,
    forgotPasswordValidation,
    loginUserValidation,
    signUpUserValidation,
    updateUserValidation,
} from '../validations/users';
import { getShoes, getUserShoe } from '../controllers/shoes';
import { getShoeValidation, getShoesValidation } from '../validations/shoes';

const usersRouter = Router();

usersRouter.post('/signup', validate(signUpUserValidation), signUpUser);

usersRouter.post('/login', validate(loginUserValidation), loginUser);

usersRouter.post('/forgot-password', validate(forgotPasswordValidation), forgotPassword);

usersRouter.get('/verify-email/:token', verifyEmail);

usersRouter.use(verifyUser);

usersRouter.get('/me', getUser);

usersRouter.put('/change-password', validate(changeUserPasswordValidation), changePassword);

usersRouter.put('/update', validate(updateUserValidation), updateUser);

usersRouter.get('/shoes', validate(getShoesValidation), getShoes);

usersRouter.get('/shoes/:id', validate(getShoeValidation), getUserShoe);

usersRouter.get('/send-email-verification-mail', sendEmailVerificationLink);

export default usersRouter;
