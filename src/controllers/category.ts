import { NextFunction, Response } from 'express';
import { AdminAuthenticatedRequest } from '../utils/interfaces';
import { messages } from '../utils/constants';
import { Category, ICategory } from '../db/models/category';
import path from 'path';
import * as fs from 'fs';
import { Shoes } from '../db/models/shoes';

export const addCategory = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { name, description }: ICategory = req.body;
        const file = req.file;

        let image = '';
        const folderPath = `public/categories`;

        fs.mkdirSync(folderPath, { recursive: true });

        if (file) {
            image = `${Date.now()}${path.extname(file.originalname)}`;
            fs.writeFileSync(`${folderPath}/${image}`, file.buffer);
        }

        const category = await Category.create({ name, description, image });

        return res.status(201).json({ category, success: true });
    } catch (error) {
        return next(error);
    }
};

export const getCategories = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const limit: number = Math.abs(parseInt(req?.query?.limit?.toString() || '10'));
        const skip: number = Math.abs(parseInt(req?.query?.skip?.toString() || '0'));
        const search: string = req?.query?.search?.toString() || '';

        const query = { name: { $regex: search, $options: 'i' } };

        const categories = await Category.find(query).limit(limit).skip(skip);

        const total = await Category.countDocuments(query);

        return res.status(200).json({ categories, total, success: true });
    } catch (error) {
        return next(error);
    }
};

export const getCategory = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) throw new Error(messages.CATEGORY_NOT_FOUND);

        return res.status(200).json({ category, success: true });
    } catch (error) {
        return next(error);
    }
};

export const updateCategory = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id, name, description }: ICategory = req.body;
        const file = req.file;

        const category = await Category.findById(id);

        if (!category) throw new Error(messages.CATEGORY_NOT_FOUND);

        let image = '';
        const folderPath = `public/categories`;

        fs.mkdirSync(folderPath, { recursive: true });

        if (file) {
            if (category.image) if (fs.existsSync(`${folderPath}/${category.image}`)) fs.unlinkSync(`${folderPath}/${category.image}`);
            image = `${Date.now()}${path.extname(file.originalname)}`;
            fs.writeFileSync(`${folderPath}/${image}`, file.buffer);
        }

        category.name = name;
        category.description = description;
        category.image = image || category.image;

        await category.save();

        return res.status(200).json({ category, success: true });
    } catch (error) {
        return next(error);
    }
};

export const deleteCategory = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) throw new Error(messages.CATEGORY_NOT_FOUND);

        const shoes = await Shoes.find({ categoryId: id });

        if (shoes.length) throw new Error(messages.CATEGORY_HAS_SHOES);

        await category.deleteOne();

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};

export const deleteCategoryImage = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) throw new Error(messages.CATEGORY_NOT_FOUND);

        const imagePath = `public/categories/${category.image}`;

        if (category.image && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

        category.image = '';

        await category.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};
