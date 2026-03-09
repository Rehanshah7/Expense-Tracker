import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
    userId: mongoose.Types.ObjectId;
    categoryId?: mongoose.Types.ObjectId; // Optional: If null, it represents total monthly budget
    amount: number;
    month: string; // Format: "YYYY-MM"
    createdAt: Date;
    updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: null
        },
        amount: {
            type: Number,
            required: true,
            min: [0.01, 'Budget amount must be greater than 0']
        },
        month: {
            type: String,
            required: true,
            match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format'] // Strict validation for YYYY-MM
        }
    },
    {
        timestamps: true
    }
);

// A user can only have ONE total budget per month OR ONE budget per specific category per month
budgetSchema.index({ userId: 1, categoryId: 1, month: 1 }, { unique: true });

export const Budget = mongoose.model<IBudget>('Budget', budgetSchema);
