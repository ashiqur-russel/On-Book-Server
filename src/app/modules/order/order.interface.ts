import { Types } from 'mongoose';

export interface IOrder {
  email: string;
  product: Types.ObjectId;
  user: Types.ObjectId;
  status: 'pending' | 'completed';
  quantity: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
