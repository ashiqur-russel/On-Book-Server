import { Types } from 'mongoose';
import {
  ORDER_STATUSES,
  DELIVERY_STATUSES,
  REFUND_STATUSES,
} from './order.constant';

export interface IOrder {
  email: string;
  product: Types.ObjectId;
  user: Types.ObjectId;
  payment: Types.ObjectId | null;
  status: (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];
  deliveryStatus?: (typeof DELIVERY_STATUSES)[keyof typeof DELIVERY_STATUSES];
  refundStatus?: (typeof REFUND_STATUSES)[keyof typeof REFUND_STATUSES];
  quantity: number;
  totalPrice: number;
  ratings?: number;
  review?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
