import { Types } from 'mongoose';

export interface IOrder {
  email: string;
  product: Types.ObjectId;
  user: Types.ObjectId;
  payment?: Types.ObjectId | null;
  deliveryStatus?:
    | 'pending'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'revoked';
  quantity: number;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}
