import { Document, Schema, model } from 'mongoose';
import { config } from '../../services/config';

const baseUrl = config.baseUrl;

export interface FeedbackInterface {
    description: string;
    rating: number;
    userId: string;
    shoeId: string;
    image: string;
}

export interface IFeedback extends FeedbackInterface, Document {}

const feedbackSchema = new Schema<IFeedback>(
    {
        description: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        userId: { type: String, ref: 'User', required: true },
        shoeId: { type: String, ref: 'Shoes', required: true },
        image: { type: String, default: '', required: false },
    },
    { timestamps: true, toJSON: { getters: true } }
);

feedbackSchema.virtual('imageUrl').get(function (this: IFeedback) {
    return this.image ? `${baseUrl}/feedbacks/${this.image}` : '';
});

export const Feedback = model<IFeedback>('Feedback', feedbackSchema);
