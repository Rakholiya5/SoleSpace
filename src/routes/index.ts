import { Router } from 'express';
import adminRouter from './admin';
import shoesRouter from './shoes';
import { verifyAdmin } from '../middlewares/auth';
import usersRouter from './users';
import cartRouter from './cart';
import orderRouter from './order';

const routes = Router();

routes.use('/admin', adminRouter);

routes.use('/shoes', verifyAdmin, shoesRouter);

routes.use('/users', usersRouter);

routes.use('/cart', cartRouter);

routes.use('/orders', orderRouter);

export default routes;
