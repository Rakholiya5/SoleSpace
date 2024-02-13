import { Router } from 'express';
import { changePassword, getUser, loginUser, signUpUser, updateUser } from '../controllers/users';
import { verifyUser } from '../middlewares/auth';
import { validate } from '../utils/helper';
import { changeUserPasswordValidation, loginUserValidation, signUpUserValidation, updateUserValidation } from '../validations/users';
import { getShoes } from '../controllers/shoes';

const usersRouter = Router();

usersRouter.post('/signup', validate(signUpUserValidation), signUpUser);

usersRouter.post('/login', validate(loginUserValidation), loginUser);

usersRouter.use(verifyUser);

usersRouter.get('/me', getUser);

usersRouter.put('/change-password', validate(changeUserPasswordValidation), changePassword);

usersRouter.put('/update', validate(updateUserValidation), updateUser);

usersRouter.get('/shoes', getShoes);

export default usersRouter;
