import { NextFunction, Request, Response } from 'express';
import { Admin, AdminInterface } from '../db/models/admin';
import { getJwtToken } from '../utils/helper';
import { AdminAuthenticatedRequest } from '../utils/interfaces';
import { messages } from '../utils/constants';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password }: AdminInterface = req.body;

        if (!email || !password) throw new Error(messages.EMAIL_AND_PASSWORD_REQUIRED);

        const admin = await Admin.findOne({ email });

        if (!admin) throw new Error(messages.USER_NOT_FOUND);

        const validPassword = await admin.comparePassword(password);

        if (!validPassword) throw new Error(messages.INVALID_PASSWORD);

        const token = getJwtToken(admin._id, admin.sequence);

        return res.status(200).json({ admin, token, success: true });
    } catch (error) {
        return next(error);
    }
};

export const createAdmin = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { email, password }: AdminInterface = req.body;

        if (!email || !password) throw new Error(messages.EMAIL_AND_PASSWORD_REQUIRED);

        const exist = await Admin.findOne({ email });

        if (exist) throw new Error(messages.EMAIL_ALREADY_EXISTS);

        const admin = await Admin.create({ email, password });

        return res.status(201).json({ admin, success: true });
    } catch (error) {
        return next(error);
    }
};

export const getAdmin = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const admin = await Admin.findById(req.admin?._id);

        if (!admin) throw new Error(messages.ADMIN_NOT_FOUND);

        return res.status(200).json({ admin, success: true });
    } catch (error) {
        return next(error);
    }
};

export const changePassword = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword }: { oldPassword: string; newPassword: string } = req.body;

        const admin = await Admin.findById(req.admin?._id);

        if (!admin) throw new Error(messages.ADMIN_NOT_FOUND);

        const validPassword = await admin.comparePassword(oldPassword);

        if (!validPassword) throw new Error(messages.INVALID_PASSWORD);

        admin.password = newPassword;
        admin.sequence += 1;

        await admin.save();

        const token = getJwtToken(admin._id, admin.sequence);

        return res.status(200).json({ admin, token, success: true });
    } catch (error) {
        return next(error);
    }
};
