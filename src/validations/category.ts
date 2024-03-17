import { Joi, Segments } from 'celebrate';
import { stringRequired } from './constant';

export const addCategoryValidation = {
    [Segments.BODY]: Joi.object().keys({
        name: stringRequired,
        description: stringRequired,
    }),
};

export const updateCategoryValidation = {
    [Segments.BODY]: Joi.object().keys({
        id: stringRequired,
        name: stringRequired,
        description: stringRequired,
    }),
};
