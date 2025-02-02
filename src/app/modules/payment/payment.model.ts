import mongoose, { Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/.+@.+\..+/, 'Invalid email format.'],
    },
    stripePaymentId: {
      type: String,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required.'],
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
    },
    status: {
      type: String,
      enum: ['completed', 'refunded'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

PaymentSchema.index({ user: 1, createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
