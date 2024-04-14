import { Document, Schema, model } from 'mongoose';
import { OrderStatus } from '../../utils/constants';
import { setStringType } from './admin';

export interface IOrder extends Document {
    userId: string;
    total: number;
    tax: number;
    finalTotal: number;
    status: OrderStatus;
    line1: string;
    city: string;
    country: string;
    postalCode: string;
    state: string;
    phone: string;
    isPaid: boolean;
}

const orderSchema = new Schema<IOrder>(
    {
        userId: { type: String, required: true, ref: 'User' },
        total: { type: Number, required: true },
        tax: { type: Number, required: true },
        finalTotal: { type: Number, required: true },
        status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
        line1: { type: String, required: true, set: setStringType },
        city: { type: String, required: true, set: setStringType },
        country: { type: String, required: true, set: setStringType },
        postalCode: { type: String, required: true, set: setStringType },
        state: { type: String, required: true, set: setStringType },
        phone: { type: String, required: true, set: setStringType },
        isPaid: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Order = model<IOrder>('Order', orderSchema);
