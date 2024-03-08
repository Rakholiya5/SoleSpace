import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { SchemaOptions, celebrate } from 'celebrate';
import { config } from '../services/config';
import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';

export const getJwtToken = (user_id: ObjectId, sequence: number) => {
    const secret = config.jwtSecret;
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

export const generateTempPassword = () => {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    let tempPassword = '';
    tempPassword += sample(upperCase);
    tempPassword += sample(lowerCase);
    tempPassword += sample(numbers);

    for (let i = 0; i < 5; i++) {
        tempPassword += sample(upperCase + lowerCase + numbers);
    }

    return shuffle(tempPassword).join('');
};
