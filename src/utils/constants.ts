export const messages = <const>{
    INTERNAL_SERVER_ERROR: 'Internal server error',
    UNAUTHORIZED: 'Unauthorized',
    EMAIL_AND_PASSWORD_REQUIRED: 'Email and password are required',
    USER_NOT_FOUND: 'User not found',
    INVALID_PASSWORD: 'Invalid password',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    ADMIN_NOT_FOUND: 'Admin not found',
    REQUEST_VALIDATION_FAILED: 'Request validation failed',
    SHOE_NOT_FOUND: 'Shoe not found',
    USER_EXISTS: 'User already exists',
    DETAILS_NOT_FOUND: 'Details not found',
    IMAGE_REQUIRED: 'Image is required',
    INSUFFICIENT_QUANTITY: 'Insufficient quantity',
    CART_ITEM_NOT_FOUND: 'Cart item not found',
    CART_EMPTY: 'Cart is empty',
    ORDER_NOT_FOUND: 'Order not found',
    CATEGORY_NOT_FOUND: 'Category not found',
    CATEGORY_HAS_SHOES: 'Category has shoes',
    EMAIL_NOT_VERIFIED: 'Email not verified',
    EMAIL_VERIFIED: 'Email is already verified',
    INVALID_TOKEN: 'Invalid token',
    FEEDBACK_ALREADY_EXISTS: 'Feedback already exists',
    FEEDBACK_NOT_FOUND: 'Feedback not found',
    YOU_HAVE_NOT_PURCHASED_THIS_PRODUCT_YET: 'You have not purchased this product yet',
};

export const PASSWORD_SALT_ROUNDS = 10;

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    DELIVERED = 'DELIVERED',
}

export enum PaymentMethod {
    CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}
