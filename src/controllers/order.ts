import { NextFunction, Request, Response } from 'express';
import { AdminAuthenticatedRequest, UserAuthenticatedRequest } from '../utils/interfaces';
import { OrderStatus, PaymentMethod, TAX_PERCENTAGE, messages } from '../utils/constants';
import { Users } from '../db/models/users';
import { Cart } from '../db/models/cart';
import { Shoes } from '../db/models/shoes';
import { IOrder, Order } from '../db/models/order';
import mongoose, { FilterQuery } from 'mongoose';
import Stripe from 'stripe';
import { config } from '../services/config';

export const stripe = new Stripe(config.stripeSecret);

export const createOrder = async (req: UserAuthenticatedRequest, res: Response, next: NextFunction) => {
    let mongoSession: mongoose.mongo.ClientSession | null = null;
    try {
        const { line1, city, country, postalCode, state, phone, paymentMethod }: IOrder & { paymentMethod: PaymentMethod } = req.body;

        const user = await Users.findById(req.user?._id);

        if (!user) throw new Error(messages.USER_NOT_FOUND);

        if (!user.isEmailVerified) throw new Error(messages.EMAIL_NOT_VERIFIED);

        const cartItems = await Cart.find({ userId: user._id, orderId: null });

        if (!cartItems.length) throw new Error(messages.CART_EMPTY);

        let total = 0;
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

        mongoSession = await mongoose.startSession();

        for (const item of cartItems) {
            const shoe = await Shoes.findById(item.shoeId);

            if (!shoe) throw new Error(messages.SHOE_NOT_FOUND);

            const details = shoe.details.find((detail) => detail?._id?.toString() === item.detailId);

            if (!details) throw new Error(messages.DETAILS_NOT_FOUND);

            if (details.quantity < item.quantity) throw new Error(messages.INSUFFICIENT_QUANTITY);

            details.quantity -= item.quantity;

            await shoe.save({ session: mongoSession });

            const perItemTax = +((shoe.price * TAX_PERCENTAGE) / 100).toFixed(2) * 100;

            line_items.push({
                price_data: {
                    currency: 'cad',
                    product_data: {
                        name: shoe.name,
                        description: shoe.description,
                        images: details.images,
                    },
                    unit_amount: shoe.price * 100 + perItemTax,
                },
                quantity: item.quantity,
            });

            total += shoe.price * item.quantity;
        }

        total = +total.toFixed(2);
        const tax = +((total * TAX_PERCENTAGE) / 100).toFixed(2);
        const finalTotal = +(total + tax).toFixed(2);

        const order = await Order.create(
            {
                userId: user._id,
                line1,
                city,
                country,
                postalCode,
                state,
                phone,
                total,
                tax,
                finalTotal,
                paymentMethod,
            },
            { session: mongoSession }
        );

        await Cart.updateMany({ userId: user._id, orderId: null }, { orderId: order[0]._id }, { session: mongoSession });

        if (paymentMethod !== PaymentMethod.CASH_ON_DELIVERY) {
            if (!user.stripe_id) {
                const customer = await stripe.customers.create({
                    email: user.email,
                    name: user.name,
                    // phone: user.phone,
                    // address: {
                    //     line1: user.line1,
                    //     city: user.city,
                    //     country: user.country,
                    //     postal_code: user.postalCode,
                    //     state: user.state,
                    // },
                });

                user.stripe_id = customer.id;

                await user.save({ session: mongoSession });
            }

            const customer = await stripe.customers.retrieve(user.stripe_id);

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                customer: customer.id,
                billing_address_collection: 'required',
                phone_number_collection: {
                    enabled: true,
                },
                line_items,
                mode: 'payment',
                success_url: `${config.clientUrl}/orders`,
                cancel_url: `${config.clientUrl}/checkout/cancel`,
                metadata: {
                    orderId: order._id.toString(),
                },
                currency: 'cad',
                // payment_intent_data: {
                //     metadata: {
                //         orderId: order._id,
                //     },
                // },
            });

            return res.status(201).json({ url: session.url, success: true });
        }

        await mongoSession.commitTransaction();
        return res.status(201).json({ success: true });
    } catch (error) {
        if (mongoSession) await mongoSession.abortTransaction();
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

export const webhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sig = req.headers['stripe-signature'] as string;
        const body = req.body;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(body, sig, config.stripeWebhookSecret);
        } catch (error: unknown) {
            // console.log('error', error);

            return res.status(400).send(`Webhook Error: ${JSON.stringify(error) || 'Invalid signature'}`);
        }

        console.log('event', event.type);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            const order = await Order.findById(session?.metadata?.orderId);

            if (!order) throw new Error(messages.ORDER_NOT_FOUND);

            order.isPaid = true;

            await order.save();
        }

        return res.json({ received: true });
    } catch (error) {
        return next(error);
    }
};
