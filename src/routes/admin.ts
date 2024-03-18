import { Router } from 'express';
import {
    addUser,
    changePassword,
    createAdmin,
    deleteUser,
    forgotPassword,
    getAdmin,
    getRandomPassword,
    getUser,
    getUsers,
    login,
    updateUser,
} from '../controllers/admin';
import { verifyAdmin } from '../middlewares/auth';
import {
    addUserValidation,
    changePasswordValidation,
    createAdminValidation,
    loginValidation,
    updateUserValidation,
} from '../validations/admin';
import { validate } from '../utils/helper';
import { forgotPasswordValidation } from '../validations/users';

const adminRouter = Router();

adminRouter.post('/login', validate(loginValidation), login);

adminRouter.post('/forgot-password', validate(forgotPasswordValidation), forgotPassword);

adminRouter.use(verifyAdmin);

adminRouter.post('/create', validate(createAdminValidation), createAdmin);

adminRouter.get('/me', getAdmin);

adminRouter.put('/change-password', validate(changePasswordValidation), changePassword);

adminRouter.get('/users', getUsers);

adminRouter.get('/users/:id', getUser);

adminRouter.post('/users/add', validate(addUserValidation), addUser);

adminRouter.get('/random-password', getRandomPassword);

adminRouter.put('/users/update/:id', validate(updateUserValidation), updateUser);

adminRouter.delete('/users/delete/:id', deleteUser);

export default adminRouter;
