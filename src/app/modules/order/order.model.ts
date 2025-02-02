import mongoose, { Schema } from 'mongoose';
import { IOrder } from './order.interface';

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
      default: null,
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
      enum: ['completed', 'cancelled'],
      default: 'completed',
    },
    deliveryStatus: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'revoked'],
      default: 'pending',
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
