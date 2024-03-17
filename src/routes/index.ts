import { Router } from 'express';
import adminRouter from './admin';
import shoesRouter from './shoes';
import { verifyAdmin } from '../middlewares/auth';
import usersRouter from './users';
import { adminCartRouter, userCartRouter } from './cart';
import { adminOrderRouter, userOrderRouter } from './order';
import { adminCategoryRouter } from './category';

const routes = Router();

routes.use('/admin', adminRouter);

routes.use('/shoes', verifyAdmin, shoesRouter);

routes.use('/users', usersRouter);

routes.use('/admin-cart', adminCartRouter);

routes.use('/users-cart', userCartRouter);

routes.use('/admin-orders', adminOrderRouter);

routes.use('/users-orders', userOrderRouter);

routes.use('/admin-category', adminCategoryRouter);

export default routes;
