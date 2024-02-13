import { NextFunction, Request, Response } from 'express';
import { Users, usersInterface } from '../db/models/users';
import { messages } from '../utils/constants';
import { UserAuthenticatedRequest } from '../utils/interfaces';
import { getJwtToken } from '../utils/helper';

export const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, address, age, name, phone }: usersInterface = req.body;

        const isEmailExists = await Users.findOne({ email });

        if (isEmailExists) throw new Error(messages.USER_EXISTS);

        const user = await Users.create({ email, password, address, age, name, phone });

        const token = getJwtToken(user._id, user.sequence);

        return res.status(201).json({ user, token, success: true });
    } catch (error) {
        return next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password }: usersInterface = req.body;

        const user = await Users.findOne({ email });

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        const validPassword = await user.comparePassword(password);

        if (!validPassword) throw new Error(messages.INVALID_PASSWORD);

        const token = getJwtToken(user._id, user.sequence);

        return res.status(200).json({ user, token, success: true });
    } catch (error) {
        return next(error);
    }
};

export const getUser = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const user = await Users.findById(req.user?._id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        return res.status(200).json({ user, success: true });
    } catch (error) {
        return next(error);
    }
};

export const changePassword = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { oldPassword, newPassword }: { oldPassword: string; newPassword: string } = req.body;

        const user = await Users.findById(req.user?._id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        const validPassword = await user.comparePassword(oldPassword);

        if (!validPassword) throw new Error(messages.INVALID_PASSWORD);

        user.password = newPassword;
        user.sequence += 1;

        await user.save();

        const token = getJwtToken(user._id, user.sequence);

        return res.status(200).json({ user, token, success: true });
    } catch (error) {
        return next(error);
    }
};

export const updateUser = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { name, address, age, phone }: usersInterface = req.body;

        const user = await Users.findById(req.user?._id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        user.set({ name, address, age, phone });

        await user.save();

        return res.status(200).json({ user, success: true });
    } catch (error) {
        return next(error);
    }
};
