import { Document, Schema, model } from 'mongoose';

export interface CartInterface {
    userId: string;
    shoeId: string;
    detailId: string;
    quantity: number;
    orderId?: string;
}

export interface ICart extends Document, CartInterface {}

const cartSchema = new Schema<ICart>(
    {
        userId: { type: String, required: true, ref: 'User' },
        shoeId: { type: String, required: true, ref: 'Shoe' },
        detailId: { type: String, required: true, ref: 'Details' },
        quantity: { type: Number, required: true, default: 1 },
        orderId: { type: String, ref: 'Order', default: null },
    },
    { timestamps: true }
);

export const Cart = model<ICart>('Cart', cartSchema);
