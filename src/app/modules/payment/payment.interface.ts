import { Types } from 'mongoose';

export interface IPayment {
  email: string;
  product: Types.ObjectId;
  order: Types.ObjectId;
  user: Types.ObjectId;
  status: 'pending' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}
