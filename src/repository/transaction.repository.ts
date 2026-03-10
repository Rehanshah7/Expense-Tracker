import { Transaction, ITransaction, TransactionType, PaymentMethod } from '../models/transaction.model';
import mongoose from 'mongoose';

export interface CreateTransactionPayload {
    userId: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    date: Date;
    note?: string;
    paymentMethod: PaymentMethod;
}

export interface UpdateTransactionPayload {
    amount?: number;
    categoryId?: string;
    date?: Date;
    note?: string;
    paymentMethod?: PaymentMethod;
}

export interface TransactionFilters {
    userId: string;
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
    type?: string;
    page?: number;
    limit?: number;
}

export const createTransactionRepository = async (payload: CreateTransactionPayload): Promise<ITransaction> => {
    const transaction = new Transaction(payload);
    return await transaction.save();
};

export const getTransactionsRepository = async (filters: TransactionFilters) => {
    const { userId, startDate, endDate, categoryId, type, page = 1, limit = 20 } = filters;

    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = startDate;
        if (endDate) query.date.$lte = endDate;
    }

    if (categoryId) {
        query.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    if (type) {
        query.type = type;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        Transaction.find(query)
            .sort({ date: -1 }) // Sort DESC by date
            .skip(skip)
            .limit(limit)
            .populate('categoryId', 'name icon color') // Populate basic category info
            .lean(),
        Transaction.countDocuments(query)
    ]);

    return {
        data,
        page,
        limit,
        total
    };
};

export const getTransactionByIdRepository = async (id: string, userId: string): Promise<ITransaction | null> => {
    return await Transaction.findOne({ _id: id, userId });
};

export const updateTransactionRepository = async (
    id: string,
    userId: string,
    updateData: UpdateTransactionPayload
): Promise<ITransaction | null> => {
    return await Transaction.findOneAndUpdate(
        { _id: id, userId },
        { $set: updateData },
        { new: true, runValidators: true }
    );
};

export const deleteTransactionRepository = async (id: string, userId: string): Promise<ITransaction | null> => {
    return await Transaction.findOneAndDelete({ _id: id, userId });
};
