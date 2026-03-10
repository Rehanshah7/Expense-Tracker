import mongoose from 'mongoose';
import { Transaction } from '../models/transaction.model';
import { getBudgetsWithProgressService } from '../services/budget.service';

export const getBudgetVsExpenseReportService = async (userId: string, month: string) => {
    // This is essentially getting the budget progress overview which we already built!
    return await getBudgetsWithProgressService(userId, month);
};

export const getCategoryTrendReportService = async (userId: string) => {
    // Shows the last 6 months of expenses, grouped by category and month
    const objectId = new mongoose.Types.ObjectId(userId);

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1); // 6 months inclusive

    const result = await Transaction.aggregate([
        {
            $match: {
                userId: objectId,
                type: 'expense',
                date: { $gte: sixMonthsAgo }
            }
        },
        {
            $group: {
                _id: {
                    month: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    categoryId: "$categoryId"
                },
                amount: { $sum: "$amount" }
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: '_id.categoryId',
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
                month: '$_id.month',
                categoryId: '$_id.categoryId',
                categoryName: '$categoryInfo.name',
                categoryIcon: '$categoryInfo.icon',
                categoryColor: '$categoryInfo.color',
                amount: 1
            }
        },
        {
            $sort: { month: 1, amount: -1 }
        }
    ]);

    // Format output to be friendlier for charts: Group by category, show list of their months
    const aggregatedTrends: Record<string, any> = {};

    result.forEach(item => {
        const catId = item.categoryId.toString();
        if (!aggregatedTrends[catId]) {
            aggregatedTrends[catId] = {
                categoryId: catId,
                categoryName: item.categoryName,
                categoryIcon: item.categoryIcon,
                categoryColor: item.categoryColor,
                trends: []
            };
        }
        aggregatedTrends[catId].trends.push({
            month: item.month,
            amount: item.amount
        });
    });

    return Object.values(aggregatedTrends);
};
