import { setBudgetRepository, getBudgetsRepository, CreateBudgetPayload } from './budget.repository';
import { Category } from '../models/category.model';
import { Transaction } from '../transaction/transaction.model';
import mongoose from 'mongoose';

export const setBudgetService = async (payload: CreateBudgetPayload) => {
    if (payload.categoryId) {
        const category = await Category.findById(payload.categoryId);
        if (!category) {
            throw new Error('CATEGORY_NOT_FOUND');
        }
        if (category.userId.toString() !== payload.userId) {
            throw new Error('UNAUTHORIZED_CATEGORY_ACCESS');
        }
    }

    return await setBudgetRepository(payload);
};

export const getBudgetsWithProgressService = async (userId: string, month: string) => {
    // Fetch user's set budgets for the month
    const budgets = await getBudgetsRepository(userId, month);

    // Parse the month into start and end dates
    const [yearStr, monthStr] = month.split('-');
    const startDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1);
    const endDate = new Date(parseInt(yearStr), parseInt(monthStr), 0, 23, 59, 59, 999);

    const objectId = new mongoose.Types.ObjectId(userId);

    // Calculate actual spent amounts for the month using aggregation
    const expensesAggregation = await Transaction.aggregate([
        {
            $match: {
                userId: objectId,
                type: 'expense',
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$categoryId',
                spent: { $sum: '$amount' }
            }
        }
    ]);

    // Map `categoryId -> spent amount`
    const expenseMap: Record<string, number> = {};
    let totalSpentMonth = 0;

    expensesAggregation.forEach(item => {
        const catId = item._id.toString();
        expenseMap[catId] = item.spent;
        totalSpentMonth += item.spent;
    });

    // Merge budgets with actual spent data
    const progress = budgets.map(budget => {
        const catId = budget.categoryId ? (budget.categoryId as any)._id.toString() : null;
        
        let spent = 0;
        if (catId) {
            spent = expenseMap[catId] || 0;
        } else {
            // It's the overall month budget
            spent = totalSpentMonth;
        }

        return {
            _id: budget._id,
            categoryId: budget.categoryId,
            month: budget.month,
            limit: budget.amount,
            spent,
            percentage: budget.amount > 0 ? (spent / budget.amount) * 100 : 0
        };
    });

    return {
        month,
        totalSpentMonth,
        budgets: progress
    };
};
