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
        subject: 'Temporary Password(forgot password)',
        html: `Your temporary password is <b>${tempPassword}</b>`,
    });
};

export const sendWelcomeEmail = async (to: string, tempPassword: string) => {
    await transport.sendMail({
        from: config.noReplyEmail,
        to,
        subject: 'Welcome to our website',
        html: `Welcome to our website, your temporary password is <b>${tempPassword}</b>`,
    });
};

export const sendEmailVerificationMail = async (to: string, verificationToken: string) => {
    await transport.sendMail({
        from: config.noReplyEmail,
        to,
        subject: 'Email Verification',
        html: `Click <a href="${config.clientUrl}/verify-email/${verificationToken}">here</a> to verify your email`,
    });
};
