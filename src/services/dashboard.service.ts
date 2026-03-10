import mongoose from 'mongoose';
import { Transaction } from '../models/transaction.model';

export const getDashboardSummaryService = async (userId: string) => {
    const objectId = new mongoose.Types.ObjectId(userId);

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const result = await Transaction.aggregate([
        {
            $match: { userId: objectId }
        },
        {
            $group: {
                _id: null,
                totalIncome: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
                    }
                },
                totalExpense: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
                    }
                },
                monthIncome: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$type', 'income'] },
                                    { $gte: ['$date', firstDayOfMonth] }
                                ]
                            },
                            '$amount',
                            0
                        ]
                    }
                },
                monthExpense: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ['$type', 'expense'] },
                                    { $gte: ['$date', firstDayOfMonth] }
                                ]
                            },
                            '$amount',
                            0
                        ]
                    }
                }
            }
        }
    ]);

    const stats = result[0] || {
        totalIncome: 0,
        totalExpense: 0,
        monthIncome: 0,
        monthExpense: 0
    };

    return {
        totalBalance: stats.totalIncome - stats.totalExpense,
        totalIncome: stats.totalIncome,
        totalExpense: stats.totalExpense,
        monthIncome: stats.monthIncome,
        monthExpense: stats.monthExpense
    };
};

export const getMonthlySummaryService = async (userId: string) => {
    const objectId = new mongoose.Types.ObjectId(userId);

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const result = await Transaction.aggregate([
        {
            $match: {
                userId: objectId,
                date: { $gte: firstDayOfMonth }
            }
        },
        {
            $group: {
                _id: '$type',
                totalAmount: { $sum: '$amount' }
            }
        }
    ]);

    const summary = {
        income: 0,
        expense: 0
    };

    result.forEach(item => {
        if (item._id === 'income') summary.income = item.totalAmount;
        if (item._id === 'expense') summary.expense = item.totalAmount;
    });

    return summary;
};

export const getCategorySummaryService = async (userId: string) => {
    const objectId = new mongoose.Types.ObjectId(userId);

    const result = await Transaction.aggregate([
        {
            $match: {
                userId: objectId,
                type: 'expense'
            }
        },
        {
            $group: {
                _id: '$categoryId',
                amount: { $sum: '$amount' }
            }
        },
        {
            $lookup: {
                from: 'categories', // The collection name in MongoDB exactly
                localField: '_id',
                foreignField: '_id',
                as: 'categoryInfo'
            }
        },
        {
            $unwind: '$categoryInfo'
        },
        {
            $project: {
                _id: 0,
                categoryId: '$_id',
                categoryName: '$categoryInfo.name',
                categoryIcon: '$categoryInfo.icon',
                categoryColor: '$categoryInfo.color',
                amount: 1
            }
        },
        {
            $sort: { amount: -1 } // Sort by highest expense
        }
    ]);

    return result;
};

export const getRecentTransactionsService = async (userId: string, limit: number = 5) => {
    return await Transaction.find({ userId })
        .sort({ date: -1 })
        .limit(limit)
        .populate('categoryId', 'name icon color')
        .lean();
};
