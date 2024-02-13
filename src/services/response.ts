import { NextFunction, Request, Response } from 'express';
import { messages } from '../utils/constants';
import { logger } from './logger';
import { isCelebrateError } from 'celebrate';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const customErrorRes = (error: string | Error, req: Request, res: Response, next: NextFunction) => {
    let message: string = messages.INTERNAL_SERVER_ERROR;
    const success = false;
    try {
        logger.error(error);

        const statusCode = 400;

        if (isCelebrateError(error)) {
            message = messages.REQUEST_VALIDATION_FAILED;

            if (error.details && error.details.entries()) {
                for (const [, joiError] of error.details.entries()) {
                    message = joiError.message;
                }
            }
        } else if (typeof error === 'string') {
            message = error;
        } else {
            message = error.message || messages.INTERNAL_SERVER_ERROR;
        }

        return res.status(statusCode).json({ message, success });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message, success });
    }
};
