import { NextFunction, Response } from 'express';
import { AdminAuthenticatedRequest, UserAuthenticatedRequest } from '../utils/interfaces';
import { OrderStatus, PaymentMethod, messages } from '../utils/constants';
import { Users } from '../db/models/users';
import { Cart } from '../db/models/cart';
import { Shoes } from '../db/models/shoes';
import { IOrder, Order } from '../db/models/order';
import { FilterQuery } from 'mongoose';

export const createOrder = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { address, phone, paymentMethod }: { cartItems: string[]; address: string; phone: string; paymentMethod: PaymentMethod } =
            req.body;

        const user = await Users.findById(req.user?._id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        const cartItems = await Cart.find({ userId: user._id, orderId: null });

        if (!cartItems.length) throw new Error(messages.CART_EMPTY);

        let total = 0;

        for (const item of cartItems) {
            const shoe = await Shoes.findById(item.shoeId);

            if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

            const details = shoe.details.find((detail) => detail?._id?.toString() === item.detailId);

            if (!details) throw new Error(messages.DETAILS_NOT_FOUND);

            if (details.quantity < item.quantity) throw new Error(messages.INSUFFICIENT_QUANTITY);

            details.quantity -= item.quantity;

            await shoe.save();

            total += shoe.price * item.quantity;
        }

        total = +total.toFixed(2);

        const order = await Order.create({ userId: user._id, address, phone, total, paymentMethod });

        await Cart.updateMany({ userId: user._id, orderId: null }, { orderId: order._id });

        return res.status(201).json({ cartItems, success: true });
    } catch (error) {
        return next(error);
    }
};

export const getPaymentMethods = (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json({ data: Object.values(PaymentMethod) });
    } catch (error) {
        return next(error);
    }
};

const getOrders = async (skip: number, limit: number, filter: FilterQuery<IOrder>, userId?: string) => {
    const orders = await Order.find({ ...filter, ...(userId && { userId }) })
        .skip(+skip)
        .limit(+limit)
        .sort({ createdAt: -1 });

    const data = [];

    for (const order of orders) {
        const cartItems = await Cart.find({ userId: order.userId, orderId: order._id });

        const user = await Users.findById(order.userId);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        const items = [];

        for (const item of cartItems) {
            const shoe = await Shoes.findById(item.shoeId);

            if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

            const details = shoe.details.find((detail) => detail?._id?.toString() === item.detailId);

            if (!details) throw new Error(messages.DETAILS_NOT_FOUND);

            items.push({
                ...item.toObject(),
                shoe: {
                    _id: shoe._id,
                    name: shoe.name,
                    price: shoe.price,
                    brand: shoe.brand,
                    description: shoe.description,
                },
                details,
            });
        }

        data.push({ ...order.toObject(), items, user });
    }

    return data;
};

export const getOrdersByUsers = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const limit: number = Math.abs(parseInt(req?.query?.limit?.toString() || '10'));
        const skip: number = Math.abs(parseInt(req?.query?.skip?.toString() || '0'));
        const status = req?.query?.status?.toString() as OrderStatus;

        const filter: FilterQuery<IOrder> = { ...(status && { status }) };

        const data = await getOrders(skip, limit, filter, req.user?._id);

        return res.status(200).json({ data, success: true });
    } catch (error) {
        return next(error);
    }
};

export const getOrdersByAdmin = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const limit: number = Math.abs(parseInt(req?.query?.limit?.toString() || '10'));
        const skip: number = Math.abs(parseInt(req?.query?.skip?.toString() || '0'));
        const status = req?.query?.status?.toString() as OrderStatus;

        const filter: FilterQuery<IOrder> = { ...(status && { status }) };

        const data = await getOrders(skip, limit, filter);

        return res.status(200).json({ data, success: true });
    } catch (error) {
        return next(error);
    }
};

export const changeOrderStatusAdmin = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { orderId, status }: { orderId: string; status: OrderStatus } = req.body;

        const order = await Order.findOne({ _id: orderId });

        if (!order) throw new Error(messages.ORDER_NOT_FOUND);

        if (order.status !== OrderStatus.PENDING) throw new Error(`You can't change order status to ${status}`);

        order.status = status;

        await order.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};

export const getOrderStatusesAdmin = async (req: AdminAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json({ data: Object.values(OrderStatus) });
    } catch (error) {
        return next(error);
    }
};
