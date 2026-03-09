import { Budget, IBudget } from './budget.model';

export interface CreateBudgetPayload {
    userId: string;
    categoryId?: string;
    amount: number;
    month: string;
}

export const setBudgetRepository = async (payload: CreateBudgetPayload): Promise<IBudget> => {
    // Upsert logic: if a budget for this user+category+month exists, update it, else create it
    const filter: any = {
        userId: payload.userId,
        month: payload.month,
        categoryId: payload.categoryId || null
    };

    return await Budget.findOneAndUpdate(
        filter,
        { $set: { amount: payload.amount } },
        { new: true, upsert: true, runValidators: true }
    );
};

export const getBudgetsRepository = async (userId: string, month: string) => {
    return await Budget.find({ userId, month }).populate('categoryId', 'name icon color').lean();
};
