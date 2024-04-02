import { NextFunction, Response } from 'express';
import { AdminAuthenticatedRequest, UserAuthenticatedRequest } from '../utils/interfaces';
import { messages } from '../utils/constants';
import { DetailsInterface, Shoes, ShoesInterface } from '../db/models/shoes';
import fs from 'fs';
import path from 'path';
import { Category } from '../db/models/category';
import { FilterQuery } from 'mongoose';
import { Feedback } from '../db/models/feedback';

export const addShoe = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { name, brand, description, price, categoryId }: ShoesInterface = req.body;

        const category = await Category.findById(categoryId);

        if (!category) throw new Error(messages.CATEGORY_NOT_FOUND);

        const shoe = await Shoes.create({ name, brand, description, price, categoryId, details: [] });

        return res.status(201).json({ shoe, success: true });
    } catch (error) {
        return next(error);
    }
};

export const getShoes = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const limit: number = Math.abs(parseInt(req?.query?.limit?.toString() || '10'));
        const skip: number = Math.abs(parseInt(req?.query?.skip?.toString() || '0'));
        const search: string = req?.query?.search?.toString() || '';
        const categoryId: string = req?.query?.categoryId?.toString() || '';
        const isFeatured: boolean = req?.query?.isFeatured === 'true';
        const minPrice: number = Math.abs(parseInt(req?.query?.minPrice?.toString() || '0'));
        const maxPrice: number = Math.abs(parseInt(req?.query?.maxPrice?.toString() || '0'));

        const query: FilterQuery<ShoesInterface> = {
            $or: [{ name: { $regex: search, $options: 'i' } }, { brand: { $regex: search, $options: 'i' } }],
            ...(isFeatured && { isFeatured }),
            ...(minPrice && { price: { $gte: minPrice } }),
            ...(maxPrice && { price: { $lte: maxPrice } }),
        };

        if (categoryId) query.categoryId = categoryId;

        const data = await Shoes.find(query).limit(limit).skip(skip).populate('categoryId');

        const shoes: (ShoesInterface & { avgRating: number })[] = [];

        for (const shoe of data) {
            const avgRating = await Feedback.aggregate([
                { $match: { shoeId: shoe._id.toString() } },
                { $group: { _id: null, avgRating: { $avg: '$rating' } } },
            ]);

            shoes.push({ ...shoe.toObject({ getters: true }), avgRating: avgRating[0]?.avgRating || 0 });
        }

        const total = await Shoes.countDocuments(query);

        return res.status(200).json({ shoes, success: true, total });
    } catch (error) {
        return next(error);
    }
};

export const getUserShoe = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const userId = req.user?._id;

        if (!userId) throw new Error(messages.USER_NOT_FOUND);

        const shoe = await Shoes.findById(id).populate('categoryId');

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        const shoeId = shoe._id.toString();

        const avgRating = await Feedback.aggregate([{ $match: { shoeId } }, { $group: { _id: null, avgRating: { $avg: '$rating' } } }]);

        const feedbacks = await Feedback.find({ shoeId, userId: { $ne: userId } });

        const userFeedback = await Feedback.findOne({ shoeId, userId });

        return res.status(200).json({ shoe, avgRating, feedbacks, success: true, userFeedback });
    } catch (error) {
        return next(error);
    }
};

export const getAdminShoe = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const shoe = await Shoes.findById(id).populate('categoryId');

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        const avgRating = await Feedback.aggregate([
            { $match: { shoeId: shoe._id.toString() } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } },
        ]);

        const feedbacks = await Feedback.find({ shoeId: shoe._id.toString() });

        return res.status(200).json({ shoe, avgRating, feedbacks, success: true });
    } catch (error) {
        return next(error);
    }
};

export const updateShoe = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, brand, description, price, categoryId }: ShoesInterface = req.body;

        const shoe = await Shoes.findById(id);

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        const category = await Category.findById(categoryId);

        if (!category) throw new Error(messages.CATEGORY_NOT_FOUND);

        shoe.set({ name, brand, description, price, categoryId });

        await shoe.save();

        return res.status(200).json({ shoe, success: true });
    } catch (error) {
        return next(error);
    }
};

export const deleteShoe = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const shoe = await Shoes.findByIdAndDelete(id);

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        const folderPath = `public/shoes/${id}`;

        if (fs.existsSync(folderPath)) fs.rmSync(folderPath);

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};

export const addShoeDetails = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { color, size, quantity }: DetailsInterface = req.body;
        const files = req.files;

        const shoe = await Shoes.findById(id);

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        if (!files?.length || !Array.isArray(files)) throw new Error(messages.IMAGE_REQUIRED);

        const folderPath = `public/shoes/${id}`;

        fs.mkdirSync(folderPath, { recursive: true });

        const images: string[] = [];

        for (const file of files) {
            const fileName = `${Date.now()}${path.extname(file.originalname)}`;
            fs.writeFileSync(`${folderPath}/${fileName}`, file.buffer);
            images.push(`${id}/${fileName}`);
        }

        shoe.details.push({ color, size, quantity, images });

        await shoe.save();

        return res.status(200).json({ shoe, success: true });
    } catch (error) {
        return next(error);
    }
};

export const updateShoeDetails = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id, detailsId } = req.params;
        const { color, size, quantity }: DetailsInterface = req.body;
        const files = req.files;

        const shoe = await Shoes.findById(id);

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        const details = shoe.details.find((detail) => detail?._id?.toString() === detailsId);

        if (!details) throw new Error(messages.DETAILS_NOT_FOUND);

        const images: string[] = [];

        if (files?.length && Array.isArray(files)) {
            const folderPath = `public/shoes/${id}`;

            fs.mkdirSync(folderPath, { recursive: true });

            for (const file of files) {
                const fileName = `${Date.now()}${path.extname(file.originalname)}`;
                fs.writeFileSync(`${folderPath}/${fileName}`, file.buffer);
                images.push(`${id}/${fileName}`);
            }
        }

        details.color = color;
        details.size = size;
        details.quantity = quantity;
        details.images = [...new Set([...details.images, ...images])];

        await shoe.save();

        return res.status(200).json({ shoe, success: true });
    } catch (error) {
        return next(error);
    }
};

export const deleteShoeDetails = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id, detailsId } = req.params;

        const shoe = await Shoes.findById(id);

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        const details = shoe.details.find((detail) => detail?._id?.toString() === detailsId);

        if (!details) throw new Error(messages.DETAILS_NOT_FOUND);

        shoe.details = shoe.details.filter((detail) => detail?._id?.toString() !== detailsId);

        for (const image of details.images) {
            const imagePath = `public/shoes/${shoe.id}/${image}`;
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }

        await shoe.save();

        return res.status(200).json({ shoe, success: true });
    } catch (error) {
        return next(error);
    }
};

export const deleteShoeImages = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id, detailsId } = req.params;
        const { images } = req.body;

        const shoe = await Shoes.findById(id);

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        const details = shoe.details.find((detail) => detail?._id?.toString() === detailsId);

        if (!details) throw new Error(messages.DETAILS_NOT_FOUND);

        details.images = details.images.filter((image) => !images.includes(image));

        for (const image of images) {
            const imagePath = `public/shoes/${shoe.id}/${image}`;
            if (fs.existsSync(image)) fs.unlinkSync(imagePath);
        }

        await shoe.save();

        return res.status(200).json({ shoe, success: true });
    } catch (error) {
        return next(error);
    }
};

export const featureShoe = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const shoe = await Shoes.findById(id);

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        shoe.isFeatured = !shoe.isFeatured;

        await shoe.save();

        return res.status(200).json({ shoe, success: true, message: shoe.isFeatured ? messages.SHOE_FEATURED : messages.SHOE_UNFEATURED });
    } catch (error) {
        return next(error);
    }
};
