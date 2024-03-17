import { config } from './config';
import { TransportOptions, createTransport } from 'nodemailer';

const transport = createTransport({
    host: config.smtpHost,
    port: +config.smtpPort,
    secure: false,
    auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
    },
} as TransportOptions);

export const sendTempPasswordEmail = async (to: string, tempPassword: string) => {
    await transport.sendMail({
        from: config.noReplyEmail,
        to,
        subject: 'Temporary Password',
        html: `Your temporary password is <b>${tempPassword}</b>`,
    });

    return tempPassword;
};