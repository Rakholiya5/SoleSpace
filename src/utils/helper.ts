import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { SchemaOptions, celebrate } from 'celebrate';

export const getJwtToken = (user_id: ObjectId, sequence: number) => {
    const secret = process.env.JWT_SECRET || 'secret';
    return jwt.sign({ user_id, sequence }, secret, { expiresIn: '7d' });
};

export const validate = (schema: SchemaOptions) => {
    return celebrate(schema, {
        errors: {
            wrap: {
                label: '',
            },
        },
    });
};
