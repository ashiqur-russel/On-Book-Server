import { Types } from 'mongoose';
import { PAYMENT_STATUSES, REFUND_STATUSES } from './payment.constant';

export interface IPayment {
  email: string;
  stripePaymentId: string;
  products: Types.ObjectId[];
  order: Types.ObjectId;
  user: Types.ObjectId;
  status: (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];
  refundStatus?: (typeof REFUND_STATUSES)[keyof typeof REFUND_STATUSES];
  refundedAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
