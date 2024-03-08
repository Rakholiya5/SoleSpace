import { Joi, Segments } from 'celebrate';
import { stringRequired } from './constant';
import { PaymentMethod } from '../utils/constants';

export const createOrderValidation = {
    [Segments.BODY]: Joi.object().keys({
        address: stringRequired,
        phone: stringRequired,
        paymentMethod: Joi.string()
            .valid(...Object.values(PaymentMethod))
            .required(),
    }),
};
