import dotenv from 'dotenv';
dotenv.config();

export const config = <const>{
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    port: process.env.PORT || 3000,
    webhookPort: process.env.WEBHOOK_PORT || 3001,
    mongoUri: process.env.MONGO_URL || 'mongodb://localhost:27017/my-db',
    jwtSecret: process.env.JWT_SECRET || 'secret',
    smtpHost: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    smtpPort: process.env.SMTP_PORT || 465,
    smtpUser: process.env.SMTP_USER || '8590c161ef6637',
    smtpPassword: process.env.SMTP_PWD || '4d190f9cdb28d8',
    noReplyEmail: process.env.NO_REPLY_EMAIL || 'noreply@solespace.com',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    stripeSecret:
        process.env.STRIPE_SECRET ||
        'sk_test_51P2S5BSHsPLYITOXJ0vC42LzihRFJvWjmN23DvoAa9ZOuesi5eXV0rZBF1MWA1ht9CMl0uWd8FPFEenEKqpzuKXv00OtrZgYh0',
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_ffe3e304c4ea97777f3e412c245aec5f864f110abf99b14cfda3fd0405127059',
};
