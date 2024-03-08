import { NextFunction, Response } from 'express';
import { UserAuthenticatedRequest } from '../utils/interfaces';
import { PaymentMethod, messages } from '../utils/constants';
import { Users } from '../db/models/users';
import { Cart } from '../db/models/cart';
import { Shoes } from '../db/models/shoes';
import { Order } from '../db/models/order';

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

            total += shoe.price * item.quantity;
        }

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

export const getOrders = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { skip = 0, limit = 10 } = req.query;

        const orders = await Order.find({ userId: req.user?._id }).skip(+skip).limit(+limit).sort({ createdAt: -1 });

        return res.status(200).json({ orders, success: true });
    } catch (error) {
        return next(error);
    }
};
