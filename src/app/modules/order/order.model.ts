import mongoose, { Schema } from 'mongoose';
import { IOrder } from './order.interface';
import {
  ORDER_STATUSES,
  DELIVERY_STATUSES,
  REFUND_STATUSES,
} from './order.constant';

const OrderSchema: Schema<IOrder> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/.+@.+\..+/, 'Invalid email format.'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required.'],
    },

    totalPrice: {
      type: Number,
      required: [true, 'Total price is required.'],
      min: [0, 'Total price must be a non-negative number.'],
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUSES),
      default: ORDER_STATUSES.COMPLETED,
    },
    deliveryStatus: {
      type: String,
      enum: Object.values(DELIVERY_STATUSES),
      default: DELIVERY_STATUSES.PENDING,
    },
    refundStatus: {
      type: String,
      enum: Object.values(REFUND_STATUSES),
      default: REFUND_STATUSES.NOT_REQUESTED,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
      min: [1, 'Quantity must be at least 1.'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

OrderSchema.index({ user: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
