import { Types } from 'mongoose';

export interface IPayment {
  email: string;
  stripePaymentId: string;
  product: Types.ObjectId;
  order: Types.ObjectId;
  user: Types.ObjectId;
  status: 'completed' | 'refunded';
  createdAt?: Date;
  updatedAt?: Date;
}
