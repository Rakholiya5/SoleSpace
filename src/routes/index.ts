import { Router } from 'express';
import adminRouter from './admin';
import shoesRouter from './shoes';
import { verifyAdmin } from '../middlewares/auth';
import usersRouter from './users';

const routes = Router();

routes.use('/admin', adminRouter);

routes.use('/shoes', verifyAdmin, shoesRouter);

routes.use('/users', usersRouter);

export default routes;
