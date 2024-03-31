import { Joi } from 'celebrate';

export const stringValidation = Joi.string().trim();

export const stringOptional = stringValidation.optional().allow('');

export const stringRequired = stringValidation.required();

export const password = stringRequired.min(8).max(20);

export const email = stringRequired.email();

export const numberValidation = Joi.number();

export const numberOptional = numberValidation.optional();

export const numberRequired = numberValidation.required();

export const phone = stringRequired.pattern(new RegExp('^[0-9]*$'));

export const booleanValidation = Joi.boolean();

export const booleanOptional = booleanValidation.optional();

export const booleanRequired = booleanValidation.required();
