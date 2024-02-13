import { format, createLogger, transports } from 'winston';
const { combine, timestamp, printf } = format;

const errorFormat = printf(({ level, message, timestamp }) => `${timestamp}  [${level}]  ${message}`);

export const logger = createLogger({
    level: 'info',
    format: combine(timestamp(), errorFormat),
    defaultMeta: { service: 'user-service' },
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});
