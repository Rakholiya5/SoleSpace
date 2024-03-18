import { NextFunction, Request, Response } from 'express';
import { Admin, AdminInterface } from '../db/models/admin';
import { generateTempPassword, getJwtToken } from '../utils/helper';
import { AdminAuthenticatedRequest } from '../utils/interfaces';
import { messages } from '../utils/constants';
import { sendTempPasswordEmail, sendWelcomeEmail } from '../services/mail';
import { IUsers, Users, usersInterface } from '../db/models/users';
import { FilterQuery } from 'mongoose';
import { Order } from '../db/models/order';
import { Cart } from '../db/models/cart';

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
        admin.isTempPassword = false;

        await admin.save();

        const token = getJwtToken(admin._id, admin.sequence);

        return res.status(200).json({ admin, token, success: true });
    } catch (error) {
        return next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email }: { email: string } = req.body;

        const admin = await Admin.findOne({ email });

        if (!admin) throw new Error(messages.ADMIN_NOT_FOUND);

        const tempPassword = generateTempPassword();

        await sendTempPasswordEmail(email, tempPassword);

        admin.password = tempPassword;
        admin.isTempPassword = true;
        admin.sequence += 1;

        await admin.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};

export const addUser = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { address, age, email, name, password, phone }: usersInterface = req.body;

        const user = await Users.create({ address, age, email, name, password, phone, isTempPassword: true });

        await sendWelcomeEmail(email, password);

        return res.status(200).json({ user, success: true });
    } catch (error) {
        return next(error);
    }
};

export const updateUser = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { address, age, name, phone }: usersInterface = req.body;

        const user = await Users.findById(id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        user.address = address;
        user.age = age;
        user.name = name;
        user.phone = phone;

        await user.save();

        return res.status(200).json({ user, success: true });
    } catch (error) {
        return next(error);
    }
};

export const getUsers = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const limit: number = Math.abs(parseInt(req?.query?.limit?.toString() || '10'));
        const skip: number = Math.abs(parseInt(req?.query?.skip?.toString() || '0'));
        const search: string = req?.query?.search?.toString() || '';

        const query: FilterQuery<IUsers> = {
            $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
        };

        const users = await Users.find(query).limit(limit).skip(skip);

        const total = await Users.countDocuments(query);

        return res.status(200).json({ users, success: true, total });
    } catch (error) {
        return next(error);
    }
};

export const getUser = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const user = await Users.findById(req.params.id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        return res.status(200).json({ user, success: true });
    } catch (error) {
        return next(error);
    }
};

export const getRandomPassword = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json({ password: generateTempPassword(), success: true });
    } catch (error) {
        return next(error);
    }
};

export const deleteUser = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const user = await Users.findById(req.params.id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        await Order.deleteMany({ userId: user._id });

        await Cart.deleteMany({ userId: user._id });

        await user.deleteOne();

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};
