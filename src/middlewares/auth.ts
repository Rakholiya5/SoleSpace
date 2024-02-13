import { NextFunction, Response } from 'express';
import { Admin } from '../db/models/admin';
import jwt from 'jsonwebtoken';
import { AdminAuthenticatedRequest, UserAuthenticatedRequest } from '../utils/interfaces';
import { messages } from '../utils/constants';
import { Users } from '../db/models/users';

export const verifyAdmin = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    const unauthorizedResponse = { message: messages.UNAUTHORIZED, success: false };
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json(unauthorizedResponse);
        }

        const secret = process.env.JWT_SECRET || 'secret';

        const decoded = jwt.verify(token, secret) as { user_id: string; sequence: number };
        const admin = await Admin.findById(decoded.user_id);

        if (!admin || admin.sequence !== decoded.sequence) {
            return res.status(401).json(unauthorizedResponse);
        }

        req.admin = admin;
        next();
    } catch (err) {
        return res.status(401).json(unauthorizedResponse);
    }
};

export const verifyUser = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    const unauthorizedResponse = { message: messages.UNAUTHORIZED, success: false };
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json(unauthorizedResponse);
        }

        const secret = process.env.JWT_SECRET || 'secret';

        const decoded = jwt.verify(token, secret) as { user_id: string; sequence: number };
        const user = await Users.findById(decoded.user_id);

        if (!user || user.sequence !== decoded.sequence) {
            return res.status(401).json(unauthorizedResponse);
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json(unauthorizedResponse);
    }
};
