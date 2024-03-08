import { Router } from 'express';
import { createOrder, getPaymentMethods } from '../controllers/order';
import { verifyAdmin, verifyUser } from '../middlewares/auth';
import { validate } from '../utils/helper';
import { createOrderValidation } from '../validations/order';

const userOrderRouter = Router();

userOrderRouter.use(verifyUser);

userOrderRouter.post('/create', validate(createOrderValidation), createOrder);

userOrderRouter.get('/payment-methods', getPaymentMethods);

const adminOrderRouter = Router();

adminOrderRouter.use(verifyAdmin);

export default [userOrderRouter, adminOrderRouter];
