import { Document, Schema, Types, model } from 'mongoose';
import { setStringType } from './admin';
import { config } from '../../services/config';

const baseUrl = config.baseUrl;

export interface DetailsInterface {
    _id?: Types.ObjectId;
    color: string;
    size: number;
    quantity: number;
    images: string[];
}

interface IDetails extends DetailsInterface {}

const DetailsSchema = new Schema<IDetails>(
    {
        color: { type: String, required: true, set: setStringType },
        size: { type: Number, required: true },
        quantity: { type: Number, required: true },
        images: { type: [String], default: [], get: (images: string[]) => images.map((image) => `${baseUrl}/shoes/${image}`) },
    },
    { timestamps: true, toJSON: { getters: true } }
);

export interface ShoesInterface {
    name: string;
    description: string;
    price: number;
    brand: string;
    details: DetailsInterface[];
    categoryId: string;
    isFeatured: boolean;
}

interface IShoes extends Document, ShoesInterface {}

const shoesSchema = new Schema<IShoes>(
    {
        name: { type: String, required: true, set: setStringType },
        description: { type: String, required: true, set: setStringType },
        price: { type: Number, required: true },
        brand: { type: String, required: true, set: setStringType },
        details: { type: [DetailsSchema], required: true },
        categoryId: { type: String, ref: 'Category', required: true },
        isFeatured: { type: Boolean, default: false, required: true },
    },
    { timestamps: true, toJSON: { getters: true } }
);

export const Shoes = model<IShoes>('Shoes', shoesSchema);
