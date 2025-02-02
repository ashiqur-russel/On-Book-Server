import { Types } from 'mongoose';

export interface IOrder {
  email: string;
  product: Types.ObjectId;
  user: Types.ObjectId;
  payment?: Types.ObjectId | null;
  status: 'completed' | 'cancelled';
  deliveryStatus?: 'pending' | 'shipped' | 'delivered' | 'revoked';
  quantity: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
