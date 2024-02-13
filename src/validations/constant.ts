import { Joi } from 'celebrate';

export const stringRequired = Joi.string().required();

export const password = stringRequired.min(8).max(20);

export const email = stringRequired.email();

export const numberRequired = Joi.number().required();

export const phone = stringRequired.pattern(new RegExp('^[0-9]*$'));
