import { NextFunction, Response } from 'express';
import { Feedback, IFeedback } from '../db/models/feedback';
import { messages } from '../utils/constants';
import { UserAuthenticatedRequest } from '../utils/interfaces';
import * as fs from 'fs';
import path from 'path';
import { Cart } from '../db/models/cart';

export const addFeedback = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { description, rating, shoeId }: IFeedback = req.body;
        const file = req.file;

        const existingFeedback = await Feedback.findOne({ userId: req.user?._id, shoeId });

        if (existingFeedback) throw new Error(messages.FEEDBACK_ALREADY_EXISTS);

        const isOrderExists = await Cart.findOne({ userId: req.user?._id, shoeId, orderId: { $ne: null } });

        if (!isOrderExists) throw new Error(messages.YOU_HAVE_NOT_PURCHASED_THIS_PRODUCT_YET);

        let image = '';
        const folderPath = `public/feedbacks`;

        fs.mkdirSync(folderPath, { recursive: true });

        if (file) {
            image = `${Date.now()}${path.extname(file.originalname)}`;
            fs.writeFileSync(`${folderPath}/${image}`, file.buffer);
        }

        const feedback = await Feedback.create({ description, rating, userId: req.user?._id, shoeId, image });

        return res.status(201).json({ success: true, feedback });
    } catch (error) {
        return next(error);
    }
};

export const getUserFeedbacks = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const feedbacks = await Feedback.find({ userId: req.user?._id });

        return res.status(200).json({ success: true, feedbacks });
    } catch (error) {
        return next(error);
    }
};

export const editFeedback = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { description, rating, id }: IFeedback = req.body;
        const file = req.file;

        const feedback = await Feedback.findOne({ userId: req.user?._id, _id: id });

        if (!feedback) throw new Error(messages.FEEDBACK_NOT_FOUND);

        let image = '';
        const folderPath = `public/feedbacks`;

        fs.mkdirSync(folderPath, { recursive: true });

        if (file) {
            if (feedback.image) fs.unlinkSync(`${folderPath}/${feedback.image}`);
            image = `${Date.now()}${path.extname(file.originalname)}`;
            fs.writeFileSync(`${folderPath}/${image}`, file.buffer);
        }

        feedback.description = description;
        feedback.rating = rating;
        feedback.image = image || feedback.image;

        await feedback.save();

        return res.status(200).json({ success: true, feedback });
    } catch (error) {
        return next(error);
    }
};

export const removeFeedback = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findOne({ userId: req.user?._id, _id: id });

        if (!feedback) throw new Error(messages.FEEDBACK_NOT_FOUND);

        if (feedback.image) {
            const imagePath = `public/feedbacks/${feedback.image}`;
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        await feedback.deleteOne();

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};
