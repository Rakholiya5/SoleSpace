import { Document, Schema, model } from 'mongoose';

export interface FeedbackInterface {
    description: string;
    rating: number;
    userId: string;
    shoeId: string;
    image?: string;
}

export interface IFeedback extends FeedbackInterface, Document {}

const feedbackSchema = new Schema<IFeedback>(
    {
        description: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        userId: { type: String, ref: 'User', required: true },
        shoeId: { type: String, ref: 'Shoes', required: true },
        image: { type: String, get: (image: string) => `${process.env.BASE_URL}/feedbacks/${image}` },
    },
    { timestamps: true, toJSON: { getters: true } }
);

export const Feedback = model<IFeedback>('Feedback', feedbackSchema);
