import { getBudgetsWithProgressService } from '../services/budget.service';
import { createNotificationService } from '../services/notification.service';
import { NotificationType, Notification } from '../models/notification.model';

export const checkBudgetThresholds = async (userId: string, date: Date) => {
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    // Get all budgets and their current spent amounts for this month
    const progressData = await getBudgetsWithProgressService(userId, month);

    for (const budget of progressData.budgets) {
        if (budget.limit > 0) {
            const percentage = budget.percentage;

            // Determine if we need to send 80% or 100% alert
            let thresholdLabel = '';
            
            if (percentage >= 100) {
                thresholdLabel = 'Exceeded';
            } else if (percentage >= 80) {
                thresholdLabel = 'Warning';
            }

            if (thresholdLabel) {
                const categoryTypeStr = budget.categoryId ? 'Category' : 'Total';
                const title = `Budget Alert: ${thresholdLabel} (${categoryTypeStr})`;
                const message = `You have reached ${percentage.toFixed(1)}% of your ${categoryTypeStr} budget limit for ${month}.`;

                // Check if this exact notification has already been sent
                const existingNotif = await Notification.findOne({
                    userId,
                    title,
                    message
                });

                if (!existingNotif) {
                    await createNotificationService({
                        userId,
                        title,
                        message,
                        type: NotificationType.BUDGET_ALERT
                    });
                }
            }
        }
    }
};
