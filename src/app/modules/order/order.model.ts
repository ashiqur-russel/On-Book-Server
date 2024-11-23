import mongoose, { Schema } from 'mongoose';
import { IOrder } from './order.interface';

const OrderSchema: Schema<IOrder> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/.+@.+\..+/, 'Invalid email format.'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Product ID is required.'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required.'],
      min: [0, 'Total price must be a non-negative number.'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required.'],
      min: [1, 'Quantity must be at least 1.'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: false },
    toObject: { virtuals: true },
  },
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
