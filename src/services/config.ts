import dotenv from 'dotenv';
dotenv.config();

export const config = <const>{
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/my-db',
    jwtSecret: process.env.JWT_SECRET || 'secret',
    smtpHost: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    smtpPort: process.env.SMTP_PORT || 465,
    smtpUser: process.env.SMTP_USER || '8590c161ef6637',
    smtpPassword: process.env.SMTP_PASSWORD || '4d190f9cdb28d8',
    noReplyEmail: process.env.NO_REPLY_EMAIL || 'noreply@solespace.com',
};
