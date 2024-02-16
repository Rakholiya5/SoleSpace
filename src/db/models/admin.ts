import { Document, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { PASSWORD_SALT_ROUNDS } from '../../utils/constants';

export const setStringType = (value: string) => value.trim();

export const setEmailType = (value: string) => value.toLowerCase().trim();

export interface AdminInterface {
    email: string;
    password: string;
}

export interface IAdmin extends Document, AdminInterface {
    sequence: number;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
    {
        email: { type: String, required: true, unique: true, set: setEmailType },
        password: { type: String, required: true },
        sequence: { type: Number, default: 0 },
    },
    { timestamps: true }
);

adminSchema.pre<IAdmin>('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const admin = this;

    if (!admin.isModified('password')) return next();

    const salt = await bcrypt.genSalt(PASSWORD_SALT_ROUNDS);
    const hash = await bcrypt.hash(admin.password, salt);

    admin.password = hash;
    next();
});

adminSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

export const Admin = model<IAdmin>('Admin', adminSchema);
