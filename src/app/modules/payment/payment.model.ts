import mongoose, { Schema } from 'mongoose';
import { IPayment } from './payment.interface';
import { PAYMENT_STATUSES, REFUND_STATUSES } from './payment.constant';

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
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required.'],
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    refundStatus: {
      type: String,
      enum: Object.values(REFUND_STATUSES),
      default: REFUND_STATUSES.NOT_REQUESTED,
    },
    orders: [
      {
        orderId: {
          type: Schema.Types.ObjectId,
          ref: 'Order',
          required: true,
        },
        refundStatus: {
          type: String,
          enum: Object.values(REFUND_STATUSES),
          default: REFUND_STATUSES.NOT_REQUESTED,
        },
      },
    ],

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required.'],
    },
    status: {
      type: String,
      enum: Object.values(PAYMENT_STATUSES),
      default: PAYMENT_STATUSES.COMPLETED,
    },
    refundedAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

PaymentSchema.index({ user: 1, createdAt: -1 });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
