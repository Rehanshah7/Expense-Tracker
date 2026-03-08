import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    type: 'income' | 'expense';
    icon?: string;
    color?: string;
    isDefault: boolean;
    createdAt: Date;
}

const CategorySchema: Schema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: true,
        },
        icon: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: '',
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

CategorySchema.index({ userId: 1, type: 1 });

CategorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
