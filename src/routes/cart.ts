import { Router } from 'express';
import { validate } from '../utils/helper';
import { addToCart, getMyCartsItems, removeFromCart } from '../controllers/cart';
import { verifyAdmin, verifyUser } from '../middlewares/auth';
import { addToCartValidation, removeFromCartValidation } from '../validations/cart';

const userCartRouter = Router();

userCartRouter.use(verifyUser);

userCartRouter.get('/', getMyCartsItems);

userCartRouter.post('/add-to-cart', validate(addToCartValidation), addToCart);

userCartRouter.delete('/remove-item/:cartId', validate(removeFromCartValidation), removeFromCart);

const adminCartRouter = Router();

adminCartRouter.use(verifyAdmin);

export default [userCartRouter, adminCartRouter];
