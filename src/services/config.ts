import dotenv from 'dotenv';
dotenv.config();

export const config = <const>{
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/my-db',
    jwtSecret: process.env.JWT_SECRET || 'secret',
};
