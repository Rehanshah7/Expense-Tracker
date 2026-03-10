import {
    createTransactionRepository,
    getTransactionsRepository,
    getTransactionByIdRepository,
    updateTransactionRepository,
    deleteTransactionRepository,
    CreateTransactionPayload,
    UpdateTransactionPayload,
    TransactionFilters
} from '../repository/transaction.repository';
import { Category } from '../models/category.model';
import { checkBudgetThresholds } from '../utils/budget.checker';

export const createTransactionService = async (payload: CreateTransactionPayload) => {
    // Validate category ownership
    const category = await Category.findById(payload.categoryId);

    if (!category) {
        throw new Error('CATEGORY_NOT_FOUND');
    }

    if (category.userId.toString() !== payload.userId) {
        throw new Error('UNAUTHORIZED_CATEGORY_ACCESS');
    }

    // Type must match the category type
    if (category.type !== payload.type) {
        throw new Error('INVALID_TRANSACTION_TYPE');
    }

    const transaction = await createTransactionRepository(payload);

    // After successfully saving, trigger budget checks asynchronously
    if (transaction.type === 'expense') {
        checkBudgetThresholds(payload.userId, payload.date).catch(err => console.error("Budget check error:", err));
    }

    return transaction;
};

export const getTransactionsService = async (filters: TransactionFilters) => {
    return await getTransactionsRepository(filters);
};

export const getTransactionByIdService = async (id: string, userId: string) => {
    const transaction = await getTransactionByIdRepository(id, userId);

    if (!transaction) {
        throw new Error('TRANSACTION_NOT_FOUND');
    }

    return transaction;
};

export const updateTransactionService = async (id: string, userId: string, updateData: UpdateTransactionPayload) => {
    // If category is being updated, validate ownership and type
    if (updateData.categoryId) {
        const category = await Category.findById(updateData.categoryId);

        if (!category) {
            throw new Error('CATEGORY_NOT_FOUND');
        }

        if (category.userId.toString() !== userId) {
            throw new Error('UNAUTHORIZED_CATEGORY_ACCESS');
        }
        
        // Let's also ensure the transaction being updated actually exists
        // so we can validate if the category type matches the transaction type
        const existingTx = await getTransactionByIdRepository(id, userId);
        if(!existingTx) {
            throw new Error('TRANSACTION_NOT_FOUND');
        }

        if(category.type !== existingTx.type) {
             throw new Error('INVALID_TRANSACTION_TYPE');
        }
    }

    const transaction = await updateTransactionRepository(id, userId, updateData);

    if (!transaction) {
        throw new Error('TRANSACTION_NOT_FOUND'); // Ensure they don't update someone else's
    }

    if (transaction.type === 'expense') {
         checkBudgetThresholds(userId, transaction.date).catch(err => console.error("Budget update error:", err));
    }

    return transaction;
};

export const deleteTransactionService = async (id: string, userId: string) => {
    const transaction = await deleteTransactionRepository(id, userId);

    if (!transaction) {
        throw new Error('TRANSACTION_NOT_FOUND'); // Ensure they don't delete someone else's
    }

    return transaction;
};
