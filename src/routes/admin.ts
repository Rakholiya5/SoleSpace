import { Router } from 'express';
import { changePassword, createAdmin, getAdmin, login } from '../controllers/admin';
import { verifyAdmin } from '../middlewares/auth';
import { changePasswordValidation, createAdminValidation, loginValidation } from '../validations/admin';
import { validate } from '../utils/helper';

const adminRouter = Router();

adminRouter.post('/login', validate(loginValidation), login);

adminRouter.use(verifyAdmin);

adminRouter.post('/create', validate(createAdminValidation), createAdmin);

adminRouter.get('/me', getAdmin);

adminRouter.put('/change-password', validate(changePasswordValidation), changePassword);

export default adminRouter;
