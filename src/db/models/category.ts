import { Document, Schema, model } from 'mongoose';
import { config } from '../../services/config';
import { setStringType } from './admin';

const baseUrl = config.baseUrl;

export interface CategoryInterface {
    name: string;
    description: string;
    image: string;
}

export interface ICategory extends CategoryInterface, Document {}

const categorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true, set: setStringType },
        description: { type: String, required: true, set: setStringType },
        image: { type: String, required: false },
    },
    { timestamps: true, toJSON: { getters: true } }
);

categorySchema.virtual('imageUrl').get(function (this: ICategory) {
    return this.image ? `${baseUrl}/categories/${this.image}` : '';
});

export const Category = model<ICategory>('Category', categorySchema);
