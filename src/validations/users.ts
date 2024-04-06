import { Joi, Segments } from 'celebrate';
import { stringRequired, email, password, numberRequired, phone } from './constant';
import { changePasswordValidation, loginValidation } from './admin';

export const signUpUserValidation = {
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

export const loginUserValidation = loginValidation;

export const changeUserPasswordValidation = changePasswordValidation;

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

export const forgotPasswordValidation = {
    [Segments.BODY]: Joi.object().keys({
        email,
    }),
};
