import { Router } from 'express';
import {
    changeOrderStatusAdmin,
    changeOrderStatusUser,
    createOrder,
    getOrderStatusesAdmin,
    getOrderStatusesUser,
    getOrdersByAdmin,
    getOrdersByUsers,
    getPaymentMethods,
} from '../controllers/order';
import { verifyAdmin, verifyUser } from '../middlewares/auth';
import { validate } from '../utils/helper';
import {
    changeOrderStatusAdminValidation,
    changeOrderStatusUserValidation,
    createOrderValidation,
    getOrderValidation,
} from '../validations/order';

const userOrderRouter = Router();

userOrderRouter.use(verifyUser);

userOrderRouter.post('/create', validate(createOrderValidation), createOrder);

userOrderRouter.get('/payment-methods', getPaymentMethods);

userOrderRouter.get('/', validate(getOrderValidation), getOrdersByUsers);

userOrderRouter.put('/change-status', validate(changeOrderStatusUserValidation), changeOrderStatusUser);

userOrderRouter.get('/statuses', getOrderStatusesUser);

const adminOrderRouter = Router();

adminOrderRouter.use(verifyAdmin);

adminOrderRouter.get('/', validate(getOrderValidation), getOrdersByAdmin);

adminOrderRouter.put('/change-status', validate(changeOrderStatusAdminValidation), changeOrderStatusAdmin);

adminOrderRouter.get('/statuses', getOrderStatusesAdmin);

export { adminOrderRouter, userOrderRouter };
