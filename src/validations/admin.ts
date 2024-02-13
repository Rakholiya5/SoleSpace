import { Joi, Segments } from 'celebrate';
import { stringRequired, email, password } from './constant';

export const loginValidation = {
    [Segments.BODY]: Joi.object().keys({
        email,
        password: stringRequired,
    }),
};

export const createAdminValidation = {
    [Segments.BODY]: Joi.object().keys({
        email,
        password,
    }),
};

export const changePasswordValidation = {
    [Segments.BODY]: Joi.object().keys({
        oldPassword: stringRequired,
        newPassword: password,
    }),
};
