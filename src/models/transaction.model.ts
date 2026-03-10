import mongoose, { Schema, Document } from 'mongoose';

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense'
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    UPI = 'upi',
    BANK = 'bank',
    WALLET = 'wallet'
}

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    type: TransactionType;
    categoryId: mongoose.Types.ObjectId;
    date: Date;
    note?: string;
    paymentMethod: PaymentMethod;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: [0.01, 'Amount must be greater than 0']
        },
        type: {
            type: String,
            enum: Object.values(TransactionType),
            required: true
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        note: {
            type: String,
            trim: true,
            maxlength: 500
        },
        paymentMethod: {
            type: String,
            enum: Object.values(PaymentMethod),
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Indexes
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ categoryId: 1 });
transactionSchema.index({ type: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
