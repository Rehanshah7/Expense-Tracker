import { Notification, INotification, NotificationType } from './notification.model';

export interface CreateNotificationPayload {
    userId: string;
    title: string;
    message: string;
    type?: NotificationType;
}

export const createNotificationService = async (payload: CreateNotificationPayload): Promise<INotification> => {
    const notification = new Notification(payload);
    return await notification.save();
};

export const getNotificationsService = async (userId: string) => {
    return await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20) // Get the last 20 notifications
        .lean();
};

export const markNotificationAsReadService = async (id: string, userId: string): Promise<INotification | null> => {
    return await Notification.findOneAndUpdate(
        { _id: id, userId },
        { $set: { isRead: true } },
        { new: true }
    );
};
