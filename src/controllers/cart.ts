import { NextFunction, Response } from 'express';
import { Cart } from '../db/models/cart';
import { Users } from '../db/models/users';
import { TAX_PERCENTAGE, messages } from '../utils/constants';
import { UserAuthenticatedRequest } from '../utils/interfaces';
import { Shoes } from '../db/models/shoes';

export const addToCart = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { shoeId, detailId, quantity }: { shoeId: string; detailId: string; quantity: number } = req.body;

        const user = await Users.findById(req.user?._id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        const shoe = await Shoes.findById(shoeId);

        if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

        const details = shoe.details.find((detail) => detail?._id?.toString() === detailId);

        if (!details) throw new Error(messages.DETAILS_NOT_FOUND);

        const cartItem = await Cart.findOne({ userId: user._id, shoeId, detailId, orderId: null });

        if (cartItem) {
            cartItem.quantity += quantity;

            const enoughQuantity = details.quantity >= quantity;
            if (!enoughQuantity) throw new Error(messages.INSUFFICIENT_QUANTITY);

            await cartItem.save();

            return res.status(201).json({ success: true });
        }

        const enoughQuantity = details.quantity >= quantity;
        if (!enoughQuantity) throw new Error(messages.INSUFFICIENT_QUANTITY);

        await Cart.create({ userId: user._id, shoeId, detailId, quantity });

        return res.status(201).json({ success: true });
    } catch (error) {
        return next(error);
    }
};

export const getMyCartsItems = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const user = await Users.findById(req.user?._id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        const data = await Cart.find({ userId: user._id, orderId: null });

        const cartItems = [];

        let total = 0;

        for (const item of data) {
            const shoe = await Shoes.findOne({ _id: item.shoeId });

            if (shoe) {
                const details = shoe.details.find((detail) => detail?._id?.toString() === item.detailId);

                if (details) {
                    cartItems.push({
                        ...item.toJSON(),
                        shoe: {
                            _id: shoe._id,
                            name: shoe.name,
                            price: shoe.price,
                            brand: shoe.brand,
                            description: shoe.description,
                        },
                        details,
                        subTotal: shoe.price * item.quantity,
                    });

                    total += shoe.price * item.quantity;
                }
            }
        }

        total = +total.toFixed(2);
        const tax = +((total * TAX_PERCENTAGE) / 100).toFixed(2);
        const finalTotal = +(total + tax).toFixed(2);

        return res.status(200).json({ cartItems, success: true, total, tax, finalTotal });
    } catch (error) {
        return next(error);
    }
};

export const removeFromCart = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const cartId: string = req.params.cartId;

        const user = await Users.findById(req.user?._id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        const cartItem = await Cart.findOne({ _id: cartId, userId: user._id, orderId: null });

        if (!cartItem) throw new Error(messages.CART_ITEM_NOT_FOUND);

        await cartItem.deleteOne();

        return res.status(200).json({ success: true });
    } catch (error) {
        return next(error);
    }
};
