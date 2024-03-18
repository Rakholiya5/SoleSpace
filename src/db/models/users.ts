import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { PASSWORD_SALT_ROUNDS } from '../../utils/constants';
import { setEmailType, setStringType } from './admin';

export interface usersInterface {
    email: string;
    password: string;
    name: string;
    age: number;
    address: string;
    phone: string;
    isTempPassword?: boolean;
    isEmailVerified?: boolean;
    emailVerificationToken: string | null;
}

export interface IUsers extends Document, usersInterface {
    sequence: number;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const usersSchema = new Schema<IUsers>(
    {
        email: { type: String, required: true, unique: true, set: setEmailType },
        password: { type: String, required: true },
        name: { type: String, required: true, set: setStringType },
        age: { type: Number, required: true },
        address: { type: String, required: true, set: setStringType },
        phone: { type: String, required: true, set: setStringType },
        sequence: { type: Number, default: 0 },
        isTempPassword: { type: Boolean, default: false, required: true },
        isEmailVerified: { type: Boolean, default: false, required: true },
        emailVerificationToken: { type: String, default: null, required: false },
    },
    { timestamps: true }
);

usersSchema.pre<IUsers>('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const users = this;

    if (!users.isModified('password')) return next();

    const salt = await bcrypt.genSalt(PASSWORD_SALT_ROUNDS);
    const hash = await bcrypt.hash(users.password, salt);

    users.password = hash;
    next();
});

usersSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

export const Users = model<IUsers>('Users', usersSchema);
