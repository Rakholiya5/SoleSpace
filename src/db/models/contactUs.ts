import { Document, Schema, model } from 'mongoose';
import { setStringType } from './admin';

export interface ContactUsInterface {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export interface IContactUs extends ContactUsInterface, Document {}

const contactUsSchema = new Schema<IContactUs>(
    {
        name: { type: String, required: true, set: setStringType },
        email: { type: String, required: true, set: setStringType },
        phone: { type: String, required: true, set: setStringType },
        message: { type: String, required: true, set: setStringType },
    },
    { timestamps: true, toJSON: { getters: true } }
);

export const ContactUs = model<IContactUs>('ContactUs', contactUsSchema);
