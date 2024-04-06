import { NextFunction, Request, Response } from 'express';
import { Users, usersInterface } from '../db/models/users';
import { messages } from '../utils/constants';
import { UserAuthenticatedRequest } from '../utils/interfaces';
import { generateTempPassword, getJwtToken } from '../utils/helper';
import { sendEmailVerificationMail, sendTempPasswordEmail } from '../services/mail';
import { v4 } from 'uuid';

export const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, line1, city, country, postalCode, state, age, name, phone }: usersInterface = req.body;

        const isEmailExists = await Users.findOne({ email });

        if (isEmailExists) throw new Error(messages.USER_EXISTS);

        const user = await Users.create({ email, password, line1, city, country, postalCode, state, age, name, phone });

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
        user.isTempPassword = false;

        await user.save();

        const token = getJwtToken(user._id, user.sequence);

        return res.status(200).json({ user, token, success: true });
    } catch (error) {
        return next(error);
    }
};

export const updateUser = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { name, line1, city, country, postalCode, state, age, phone }: usersInterface = req.body;

        const user = await Users.findById(req.user?._id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        user.set({ name, line1, city, country, postalCode, state, age, phone });

        await user.save();

        return res.status(200).json({ user, success: true });
    } catch (error) {
        return next(error);
    }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email }: { email: string } = req.body;

        const user = await Users.findOne({ email });

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        const tempPassword = generateTempPassword();

        await sendTempPasswordEmail(email, tempPassword);

        user.password = tempPassword;
        user.sequence += 1;
        user.isTempPassword = true;

        await user.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};

export const sendEmailVerificationLink = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const user = await Users.findById(req.user?._id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        if (user.isEmailVerified) throw new Error(messages.EMAIL_VERIFIED);

        const getEmailVerificationToken = async (): Promise<string> => {
            const token = v4();
            const isTokenExists = await Users.findOne({ emailVerificationToken: token });

            if (isTokenExists) return await getEmailVerificationToken();

            return token;
        };

        user.emailVerificationToken = await getEmailVerificationToken();

        await sendEmailVerificationMail(user.email, user.emailVerificationToken);

        await user.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.params.token as string;

        const user = await Users.findOne({ emailVerificationToken: token });

        if (!user) throw new Error(messages.INVALID_TOKEN);

        user.isEmailVerified = true;
        user.emailVerificationToken = null;

        await user.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};
