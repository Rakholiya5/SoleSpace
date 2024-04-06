import { Joi, Segments } from 'celebrate';
import { stringRequired, email, password, numberRequired, phone } from './constant';

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

export const addUserValidation = {
    [Segments.BODY]: Joi.object().keys({
        email,
        password,
        confirmPassword: Joi.ref('password'),
        name: stringRequired,
        age: numberRequired,
        line1: stringRequired,
        postalCode: stringRequired,
        city: stringRequired,
        state: stringRequired,
        country: stringRequired,
        phone,
    }),
};

export const updateUserValidation = {
    [Segments.BODY]: Joi.object().keys({
        name: stringRequired,
        age: numberRequired,
        line1: stringRequired,
        postalCode: stringRequired,
        city: stringRequired,
        state: stringRequired,
        country: stringRequired,
        phone,
    }),
};
