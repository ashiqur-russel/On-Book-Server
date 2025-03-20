import { z } from 'zod';
import {
  DELIVERY_STATUSES,
  ORDER_STATUSES,
  REFUND_STATUSES,
} from './order.constant';

const createOrderValidationSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email({ message: 'Invalid email format.' })
      .min(1, { message: 'Email is required.' }),
    user: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: 'User must be a valid ObjectId.',
    }),
    product: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: 'Product must be a valid ObjectId.',
    }),
    payment: z
      .string()
      .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: 'Product must be a valid ObjectId.',
      })
      .optional(),
    quantity: z
      .number()
      .int()
      .min(1, { message: 'Quantity must be at least 1.' }),
    totalPrice: z
      .number()
      .min(0, { message: 'Total price must be a non-negative number.' }),
    status: z.enum(Object.values(ORDER_STATUSES) as [string, ...string[]]),
    deliveryStatus: z
      .enum(Object.values(DELIVERY_STATUSES) as [string, ...string[]])
      .optional()
      .default('pending'),
    refundStatus: z
      .enum(Object.values(REFUND_STATUSES) as [string, ...string[]])
      .optional()
      .default('not_requested'),
  }),
});

const updateOrderValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email format.' }).optional(),
    user: z
      .string()
      .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: 'User must be a valid ObjectId.',
      })
      .optional(),
    product: z
      .string()
      .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: 'Product must be a valid ObjectId.',
      })
      .optional(),

    quantity: z
      .number()
      .int()
      .min(1, { message: 'Quantity must be at least 1.' })
      .optional(),
    totalPrice: z
      .number()
      .min(0, { message: 'Total price must be a non-negative number.' })
      .optional(),
    status: z
      .enum(Object.values(ORDER_STATUSES) as [string, ...string[]])
      .optional(),
    deliveryStatus: z
      .enum(Object.values(DELIVERY_STATUSES) as [string, ...string[]])
      .optional(),
    refundStatus: z
      .enum(Object.values(REFUND_STATUSES) as [string, ...string[]])
      .optional(),
  }),
  rating: z.number().int().min(1).max(5).optional(),
  review: z.string().optional(),
});

const cancelOrderValidationSchema = z.object({
  body: z.object({
    reason: z.string().optional(),
  }),
});

const changeDeliveryStatusValidationSchema = z.object({
  body: z.object({
    deliveryStatus: z.enum(
      [DELIVERY_STATUSES.SHIPPED, DELIVERY_STATUSES.DELIVERED] as [
        string,
        ...string[],
      ],
      { required_error: 'Delivery status is required.' },
    ),
  }),
});

export const OrderValidation = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
  cancelOrderValidationSchema,
  changeDeliveryStatusValidationSchema,
};
