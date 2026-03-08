import { Category } from '../models/category.model';
import mongoose from 'mongoose';
import { defaultExpenseCategories, defaultIncomeCategories } from '../constants/defaultCategories';

export const createCategoryService = async (data: any) => {
    const { userId, name, type, icon, color } = data;

    const existingCategory = await Category.findOne({ userId, name, type });

    if (existingCategory) {
        throw new Error('CATEGORY_ALREADY_EXISTS');
    }

    const category = await Category.create({
        userId,
        name,
        type,
        icon,
        color,
        isDefault: false
    });

    return category;
};

export const getCategoriesService = async (filter: any) => {
    return Category.find(filter).sort({ createdAt: -1 });
};

export const updateCategoryService = async (id: string, userId: string, data: any) => {

    const category = await Category.findById(id);

    if (!category) {
        throw new Error('CATEGORY_NOT_FOUND');
    }

    if (category.userId.toString() !== userId) {
        throw new Error('UNAUTHORIZED');
    }

    if (data.name && data.name !== category.name) {
        const duplicate = await Category.findOne({
            userId,
            name: data.name,
            type: category.type
        });

        if (duplicate) {
            throw new Error('CATEGORY_ALREADY_EXISTS');
        }

        category.name = data.name;
    }

    if (data.icon !== undefined) category.icon = data.icon;
    if (data.color !== undefined) category.color = data.color;

    await category.save();

    return category;
};

export const deleteCategoryService = async (id: string, userId: string) => {

    const category = await Category.findById(id);

    if (!category) {
        throw new Error('CATEGORY_NOT_FOUND');
    }

    if (category.userId.toString() !== userId) {
        throw new Error('UNAUTHORIZED');
    }

    await Category.findByIdAndDelete(id);
};

export const createDefaultCategoriesForUser = async (userId: mongoose.Types.ObjectId | string) => {

    const categories = [
        ...defaultExpenseCategories.map(c => ({ ...c, userId, isDefault: true })),
        ...defaultIncomeCategories.map(c => ({ ...c, userId, isDefault: true }))
    ];

    await Category.insertMany(categories);
};