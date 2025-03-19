import mongoose from 'mongoose';
import { Notification } from './notification.model';

const getNotifications = async (userId: string) => {
  const result = await Notification.find({ userId }).sort({ createdAt: -1 });

  return result;
};

const createNotification = async (userId: string, message: string) => {
  return Notification.create({
    userId: new mongoose.Types.ObjectId(userId),
    message,
    status: 'unread',
    createdAt: new Date(),
  });
};

const markAsRead = async (userId: string, notificationId: string) => {
  const updated = await Notification.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(notificationId),
      userId: new mongoose.Types.ObjectId(userId),
    },
    { status: 'read' },
    { new: true },
  );

  return updated;
};

export const NotificationServices = {
  getNotifications,
  createNotification,
  markAsRead,
};
