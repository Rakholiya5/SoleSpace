import { Joi, Segments } from 'celebrate';
import { numberRequired, stringRequired } from './constant';

export const addFeedbackValidation = {
    [Segments.BODY]: Joi.object()
        .keys({
            description: stringRequired,
            rating: numberRequired.min(1).max(5),
            shoeId: stringRequired,
        })
        .unknown(true),
};

export const editFeedbackValidation = {
    [Segments.BODY]: Joi.object()
        .keys({
            description: stringRequired,
            rating: numberRequired.min(1).max(5),
            id: stringRequired,
        })
        .unknown(true),
};
