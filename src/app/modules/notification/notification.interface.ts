import mongoose, { Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  type: string;
  status: 'unread' | 'read';
  createdAt: Date;
}
