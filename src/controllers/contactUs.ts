import { NextFunction, Request, Response } from 'express';
import { ContactUs, ContactUsInterface } from '../db/models/contactUs';
import { AdminAuthenticatedRequest } from '../utils/interfaces';
import { messages } from '../utils/constants';

export const contactUs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phone, message }: ContactUsInterface = req.body;

        const contactUs = new ContactUs({ name, email, phone, message });

        await contactUs.save();

        return res.status(200).json({ success: true, message: messages.CONTACT_US_SUCCESS, contactUs });
    } catch (error) {
        return next(error);
    }
};

export const getContactUs = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const limit: number = Math.abs(parseInt(req?.query?.limit?.toString() || '10'));
        const skip: number = Math.abs(parseInt(req?.query?.skip?.toString() || '0'));
        const search: string = req?.query?.search?.toString() || '';

        const query = {
            $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
        };

        const contactUs = await ContactUs.find(query).limit(limit).skip(skip).sort({ createdAt: -1 });

        const total = await ContactUs.countDocuments(query);

        return res.status(200).json({ contactUs, success: true, total });
    } catch (error) {
        return next(error);
    }
};
