import { Joi, Segments } from 'celebrate';
import { numberRequired, stringRequired } from './constant';

export const addToCartValidation = {
    [Segments.BODY]: Joi.object().keys({
        shoeId: stringRequired,
        detailId: stringRequired,
        quantity: numberRequired.min(1),
    }),
};

export const removeFromCartValidation = {
    [Segments.PARAMS]: Joi.object().keys({
        cartId: stringRequired,
    }),
};
