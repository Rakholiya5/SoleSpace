import { Router } from 'express';
import { changePassword, createAdmin, forgotPassword, getAdmin, login } from '../controllers/admin';
import { verifyAdmin } from '../middlewares/auth';
import { changePasswordValidation, createAdminValidation, loginValidation } from '../validations/admin';
import { validate } from '../utils/helper';
import { forgotPasswordValidation } from '../validations/users';

const adminRouter = Router();

adminRouter.post('/login', validate(loginValidation), login);

adminRouter.get('/forgot-password', validate(forgotPasswordValidation), forgotPassword);

adminRouter.use(verifyAdmin);

adminRouter.post('/create', validate(createAdminValidation), createAdmin);

adminRouter.get('/me', getAdmin);

adminRouter.put('/change-password', validate(changePasswordValidation), changePassword);

export default adminRouter;
