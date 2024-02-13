import { Joi, Segments } from 'celebrate';
import { stringRequired, numberRequired } from './constant';

export const addShoeValidation = {
    [Segments.BODY]: Joi.object().keys({
        name: stringRequired,
        brand: stringRequired,
        description: stringRequired,
        price: numberRequired.greater(0),
    }),
};

export const updateShoeValidation = {
    [Segments.BODY]: Joi.object().keys({
        name: stringRequired,
        brand: stringRequired,
        description: stringRequired,
        price: numberRequired.greater(0),
    }),
    [Segments.PARAMS]: Joi.object().keys({
        id: stringRequired,
    }),
};

export const getShoeValidation = {
    [Segments.PARAMS]: Joi.object().keys({
        id: stringRequired,
    }),
};

export const deleteShoeValidation = {
    [Segments.PARAMS]: Joi.object().keys({
        id: stringRequired,
    }),
};

export const addShoeDetailsValidation = {
    [Segments.BODY]: Joi.object().keys({
        size: numberRequired,
        color: stringRequired,
        quantity: numberRequired,
    }),
    [Segments.PARAMS]: Joi.object().keys({
        id: stringRequired,
    }),
};

export const updateShoeDetailsValidation = {
    [Segments.BODY]: Joi.object().keys({
        size: numberRequired,
        color: stringRequired,
        quantity: numberRequired,
    }),
    [Segments.PARAMS]: Joi.object().keys({
        id: stringRequired,
        detailsId: stringRequired,
    }),
};

export const deleteShoeDetailsValidation = {
    [Segments.PARAMS]: Joi.object().keys({
        id: stringRequired,
        detailsId: stringRequired,
    }),
};

export const deleteShoeImagesValidation = {
    [Segments.PARAMS]: Joi.object().keys({
        id: stringRequired,
        detailsId: stringRequired,
    }),
    [Segments.BODY]: Joi.object().keys({
        images: Joi.array().items(Joi.string()).required(),
    }),
};
