import { Router } from 'express';
import adminRouter from './admin';
import shoesRouter from './shoes';
import { verifyAdmin, verifyUser } from '../middlewares/auth';
import usersRouter from './users';
import { adminCartRouter, userCartRouter } from './cart';
import { adminOrderRouter, userOrderRouter } from './order';
import { adminCategoryRouter, userCategoryRouter } from './category';
import { feedbackRouter } from './feedback';
import { contactUsRouter } from './contactUs';
import { webhook } from '../controllers/order';

const routes = Router();

routes.use('/admin', adminRouter);

routes.use('/shoes', verifyAdmin, shoesRouter);

routes.use('/users', usersRouter);

routes.use('/admin-cart', adminCartRouter);

routes.use('/users-cart', userCartRouter);

routes.use('/admin-orders', adminOrderRouter);

routes.use('/users-orders', userOrderRouter);

routes.use('/admin-category', adminCategoryRouter);

routes.use('/users-category', verifyUser, userCategoryRouter);

routes.use('/feedback', feedbackRouter);

routes.use('/contact-us', contactUsRouter);

routes.post('/webhook', webhook);

export default routes;
