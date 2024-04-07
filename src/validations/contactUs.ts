import { Joi, Segments } from 'celebrate';
import { phone, stringRequired } from './constant';

export const contactUsValidation = {
    [Segments.BODY]: Joi.object().keys({
        name: stringRequired,
        email: stringRequired.email(),
        phone,
        message: stringRequired,
    }),
};

export const getContactUsValidation = {
    [Segments.QUERY]: Joi.object().keys({
        limit: Joi.number().positive().default(10),
        skip: Joi.number().default(0),
        search: Joi.string().default(''),
    }),
};
