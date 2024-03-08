import { Joi, Segments } from 'celebrate';
import { stringRequired } from './constant';
import { OrderStatus, PaymentMethod, adminOrderStatuses, userOrderStatuses } from '../utils/constants';

export const createOrderValidation = {
    [Segments.BODY]: Joi.object().keys({
        address: stringRequired,
        phone: stringRequired,
        paymentMethod: Joi.string()
            .valid(...Object.values(PaymentMethod))
            .required(),
    }),
};

export const getOrderValidation = {
    [Segments.QUERY]: Joi.object().keys({
        skip: Joi.number().integer().min(0).default(0),
        limit: Joi.number().integer().min(1).default(10),
        status: Joi.string().valid(...Object.values(OrderStatus)),
    }),
};

export const changeOrderStatusUserValidation = {
    [Segments.BODY]: Joi.object().keys({
        orderId: stringRequired,
        status: Joi.string()
            .valid(...userOrderStatuses)
            .required(),
    }),
};

export const changeOrderStatusAdminValidation = {
    [Segments.BODY]: Joi.object().keys({
        orderId: stringRequired,
        status: Joi.string()
            .valid(...adminOrderStatuses)
            .required(),
    }),
};
