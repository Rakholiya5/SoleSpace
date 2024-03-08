import { Document, Schema, model } from 'mongoose';
import { OrderStatus } from '../../utils/constants';

export interface IOrder extends Document {
    userId: string;
    total: number;
    status: OrderStatus;
    address: string;
    phone: string;
}

const orderSchema = new Schema<IOrder>(
    {
        userId: { type: String, required: true, ref: 'User' },
        total: { type: Number, required: true },
        status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
        address: { type: String, required: true },
        phone: { type: String, required: true },
    },
    { timestamps: true }
);

export const Order = model<IOrder>('Order', orderSchema);
