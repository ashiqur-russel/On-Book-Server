import mongoose, { Schema } from 'mongoose';
import { INotification } from './notification.interface';

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'general' },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model<INotification>(
  'Notification',
  NotificationSchema,
);
