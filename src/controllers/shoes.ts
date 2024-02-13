import { NextFunction, Response } from 'express';
import { AdminAuthenticatedRequest } from '../utils/interfaces';
import { messages } from '../utils/constants';
import { DetailsInterface, Shoes, ShoesInterface } from '../db/models/shoes';
import fs from 'fs';
import path from 'path';

export const addShoe = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { name, brand, description, price }: ShoesInterface = req.body;

        const shoe = await Shoes.create({ name, brand, description, price, details: [] });

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

        const shoes = await Shoes.find({ name: { $regex: search, $options: 'i' }, brand: { $regex: search, $options: 'i' } })
            .limit(limit)
            .skip(skip);

        return res.status(200).json({ shoes, success: true });
    } catch (error) {
        return next(error);
    }
};

export const getShoe = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const shoe = await Shoes.findById(id);

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        return res.status(200).json({ shoe, success: true });
    } catch (error) {
        return next(error);
    }
};

export const updateShoe = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, brand, description, price }: ShoesInterface = req.body;

        const shoe = await Shoes.findById(id);

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        shoe.set({ name, brand, description, price });

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

        if (files?.length && Array.isArray(files)) {
            const folderPath = `public/shoes/${id}`;

            fs.mkdirSync(folderPath, { recursive: true });

            for (const file of files) {
                const fileName = `${Date.now()}${path.extname(file.originalname)}`;
                fs.writeFileSync(`${folderPath}/${fileName}`, file.buffer);
                details.images.push(`${id}/${fileName}`);
            }
        }

        details.color = color;
        details.size = size;
        details.quantity = quantity;

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

        await shoe.save();

        return res.status(200).json({ shoe, success: true });
    } catch (error) {
        return next(error);
    }
};
